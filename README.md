# Cloak
### A <a href="https://cool.industries">Cool Industries</a> Project for Increased Data Security at SSPs

This project aims to solve a common security concern at SSPs (Syringe Service Providers): unique identifiers used in data collection to protect the identities of participants are hardly anonymous. Identifiers usually consist of a string of letters and numbers derived from something any and every participant would know. Some examples would be the X digit in someone's birthday, or the Y digit in someone's name.

The problem here is that there's a very limited set of data points from which SSPs can assume that every and any participant would know, and if the pattern gets identified (such as if such a list were to get subpoenaed or leaked) it's now a strong hint as to information on every program participant.

However, it's entirely possible (and relatively simple!) to store an encrypted version of that same unique identifier code, for an added layer of security, without having to migrate your database management system or even your existing unique identifier pattern. That's what this tool is for. 

## How it works:

1. An administrator generates a key file and determines a password, and then passes both along to staff. Best practice would be to keep the key file offline, and to store the password only in secure places (such as a password manager - my preferred app for this is <a href="https://bitwarden.com">BitWarden</a>). Passphrases (a random string of words) with numbers and/or symbols in between might be especially good for this use case - they're pretty difficult to crack, but also a lot easier to remember than a string of random characters.
2. Staff keep Cloak open in a tab or window while they work. Then, rather than entering in UIDs directly into your data management system, they'd enter them in on the Cloak webpage and use that to generate the encrypted version. The Cloak website will copy that encrypted password into the staff member's clipboard, which can then be pasted into the data management system. (Anyone evaluating this approach may want to add this as a new column, before taking the dive of replacing all of your UIDs in your database).

## What's next

Well, I'm certainly curious to see what staff and admin at SSPs think of this approach! So, gathering feedback and ideas is the first step. Feel free to <a href="mailto:michael@cool.industries">contact via email</a> if you have any thoughts or ideas, or if you're a github user please feel free to use the issue reporting system.

Some features I think would probably be helpful in adopting this system long-term: a way to batch update your database with encrypted UIDs, a way to regularly migrate to new key file & password combinations, native integration with some commonly used platforms (ie Excel, Google Sheets, Redcap). So if you're interested in commissioning or collaborating on any new features, again <a href="mailto:michael@cool.industries">please get in touch</a>! :)
