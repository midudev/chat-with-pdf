<script>
  export let i18n;
  import { Alert } from "flowbite-svelte"
  import { APP_STATUS, appStatus } from "../../store.ts"
  import StepUpload from "./StepUpload.svelte"
  import StepLoading from "./StepLoading.svelte"
  import StepChat from "./StepChat.svelte"
</script>

{#if $appStatus === APP_STATUS.INIT}
  <StepUpload {i18n} />
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading {i18n} />
{:else if $appStatus === APP_STATUS.ERROR}
  <Alert>
    <span class="font-medium">{i18n.SOMETHING_WENT_WRONG}</span>
    {i18n.ERROR_IN_APPLICATION}
  </Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
  <StepChat {i18n} />
{:else}
  <Alert>
    <span class="font-medium">{i18n.UNKNOWN_ACTION}</span>
    {i18n.UNKNOWN_APPLICATION_STATE}
  </Alert>
{/if}
