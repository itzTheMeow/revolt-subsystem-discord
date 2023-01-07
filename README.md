![RSD Logo](https://github.com/itzTheMeow/revolt-subsystem-discord/raw/master/rsd-logo-dark-mark.png)

# Revolt Subsystem for Discord

This repo is a compatibility layer for the Revolt API that uses discord's backend.

This repo is meant to _replace_ the revolt api url (api.revolt.chat => bridge.your.domain) and fetch it's content from discord without the need for client modification.

This makes it possible to use this repo for any Revolt client currently in development.

When logging in, log in as a bot and use the Discord bot token as your token. **ENABLE ALL INTENTS IN DEVELOPER SETTINGS**

When making API requests, the bridge stores and uses the provided token to identify the discord client in use. This can cause issues if more than one client is logged in under the same token. Therefore, _It's recommended to add `:__` and then a custom nonce (random number) after your token to differentiate it from other logged in sessions_. Any text after the delimiter will be trimmed from the token when logging into discord. The stored token is not saved to the disk anywhere and is deleted from memory when logging out.
