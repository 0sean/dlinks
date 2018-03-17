## DLinks

** A self-hostable Discord URL shortener. **

# What is DLinks?

DLinks is a shortener for Discord invites, which is easily self-hostable and is simple.
It is built with Node.js, Express and EJS, and uses the Discord Widget API to get guild info instead of using a bot or asking for an invite.

# Install

Assuming you have Node.js (preferrably a newer version, tested and works on v8.10.0) and NPM, download/git clone DLinks into a folder, open a Command Prompt/Terminal in that folder and run `npm i`.

# Configuring DLinks

Just open the config.json and edit all the fields to your liking.

`port` is the port DLinks is hosted on.
`title` is the name used on the pages, in the footer and in the actual title.
`author` is the name used in the footer.
`description` is the website description used on the pages.

# You're ready!

To start DLinks (in a Command Prompt/Terminal in the folder) just type `node server.js`. You may want to use PM2 to keep it running forever (`npm i -g pm2` then `pm2 start server.js --name "DLinks"`)

# "I want X issue fixing, Y thing changing or Z feature added!"

Make an issue! Please put [Issue], [Change], [Feature] or [Other] in the title so I know exactly what you want.

Or (if you know how) fork the repo, make/fix it and submit a pull request (Again, Please put [Issue], [Change], [Feature] or [Other] in the title so I know exactly what you've done)!
