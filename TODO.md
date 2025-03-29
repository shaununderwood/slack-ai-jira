* Rewrite README to document setup process and release to GitHub
* Add logging with Winston
* Add slack helpers
  * ping - returns "ok" as a liveness test
  * help
    * "create a jira ticket <message>"
    * help - this message
    * ping - returns "I'm alive"
    * status - returns:
      * Jira connection is in/active
      * Slack connection is in/active
      * Ollama connection is in/active
* Add update ticket to add comment to fira ticket, with errors etc
* test with other LLMs for speed an accuracy
* see how the LLM stores chat history
* see how to isolate chat histories
* see how to clear chat history for user
