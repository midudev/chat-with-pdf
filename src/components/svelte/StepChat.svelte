<script>
  export let i18n;
  import { Input, Label, Spinner } from "flowbite-svelte"
  import { appStatusInfo, setAppStatusError } from "../../store.ts"
  const { url, pages, id } = $appStatusInfo

  let answer = ""
  let loading = false

  const numOfImagesToShow = Math.min(pages, 4)
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1
    return url
      .replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg")
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    loading = true
    answer = ""
    const question = event.target.question.value

    const searchParams = new URLSearchParams()
    searchParams.append("id", id)
    searchParams.append("question", question)

    try {
      const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`)

      eventSource.onmessage = (event) => {
        loading = false
        const incomingData = JSON.parse(event.data)

        if (incomingData === "__END__") {
          eventSource.close()
          return
        }

        answer += incomingData
      }
    } catch (e) {
      setAppStatusError()
    } finally {
      loading = false
    }
  }
</script>

<div class="grid grid-cols-4 gap-2">
  {#each images as image}
    <img
      class="rounded w-full h-auto aspect-[400/540]"
      src={image}
      alt="PDF page"
    />
  {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
  <Label for="question" class="block mb-2">{i18n.LABEL_TEXT}</Label>
  <Input id="question" required placeholder={`${i18n.INPUT_PLACEHOLDER}`}
  ></Input>
</form>

{#if loading}
  <div class="mt-10 flex justify-center items-center flex-col gap-y-2">
    <Spinner />
    <p class="opacity-75">{i18n.AWAITING_RESPONSE}</p>
  </div>
{/if}

{#if answer}
  <div class="mt-8">
    <p class="font-medium">{i18n.RESPONSE}</p>
    <p>{answer}</p>
  </div>
{/if}
