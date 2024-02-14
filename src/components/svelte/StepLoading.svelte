<script>
  export let i18n;
  import { Spinner } from "flowbite-svelte"
</script>

<div class="flex justify-center items-center flex-col gap-y-2">
  <Spinner />
  <p class="opacity-75">{i18n.uploading}</p>
</div>
