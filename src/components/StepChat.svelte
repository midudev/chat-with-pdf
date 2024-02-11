<script>
  import { Input, Label, Spinner } from "flowbite-svelte"
  import { appStatusInfo, setAppStatusError } from "../store"
  const { url, pages, id } = $appStatusInfo

  let answer = ""
  let loading = false
  let conversation = []

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

        if (incomingData === '__END__') {
          conversation.unshift({ question, answer })
          conversation = conversation.slice(0, 5)
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
  <Label for="question" class="block mb-2">Deja aquí tu pregunta</Label>
  <Input id="question" required placeholder="¿De qué trata este documento?"
  ></Input>
</form>

{#if loading}
  <div class="mt-10 flex justify-center items-center flex-col gap-y-2">
    <Spinner />
    <p class="opacity-75">Esperando respuesta...</p>
  </div>
{/if}

<div class="mt-8 max-h-[40vh] pb-8 px-1 overflow-y-auto overflow-x-hidden flex flex-col gap-8">
  {#each conversation as { question, answer }}
    <article class="grid grid-cols-10 w-full gap-y-4 [&>p]:rounded-lg">
      <p class="flex col-start-1 col-end-8 w-full backdrop-blur-sm p-4 shadow-lg shadow-cyan-300">{answer}</p>
      <p class="justify-end flex col-start-4 col-end-11 w-full backdrop-blur-sm p-4 shadow-lg shadow-cyan-300">
        {question}
      </p>
    </article>
  {/each}
</div>
