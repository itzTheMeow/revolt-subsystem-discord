![RSD Logo](https://github.com/itzTheMeow/revolt-subsystem-discord/raw/master/rsd-logo-dark-mark.png)

# Revolt Subsystem for Discord

# I AM NOT RESPONSIBLE IF YOUR DISCORD ACCOUNT IS BANNED FOR USING THIS

This repo is a compatibility layer for the Revolt API that uses discord's backend.

This repo is meant to _replace_ the revolt api url (api.revolt.chat => bridge.your.domain) and fetch it's content from discord without the need for client modification.

This makes it possible to use this repo for any Revolt client currently in development.

When logging in, use any email and a discord user token.

When making API requests, the bridge stores and uses the provided token to identify the discord client in use. This can cause issues if more than one client is logged in under the same token. Therefore, try and use a different email for different sessions (email is used to differentiate sessions). The stored token is not saved to the disk anywhere and is deleted from memory when logging out.

## Ideas

- There is probably a hacky way to allow logging in via username/password utilizing the create account page (as both revolt and discord use hcaptcha). The only issue with that is creating an account doesn't return a token. So the token would have to be stored somehow so you can log in with it later.
