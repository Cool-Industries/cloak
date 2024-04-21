# Cloak
### A <a href="https://cool.industries">Cool Industries</a> Project for Increased Data Security at SSPs

This working proof of concept aims to solve a common security concern at SSPs (Syringe Service Providers): unique identifiers used in data collection to protect the identities of participants are hardly anonymous. Identifiers usually consist of a string of letters and numbers derived from something any and every participant would know. Some examples would be the X digit in someone's birthday, or the Y digit in someone's name.

The problem here is that there's a very limited set of data points from which SSPs can assume that every and any participant would know, and if the pattern gets identified (such as if such a list were to get subpoenaed or leaked) it's now a strong hint as to information on every program participant.

However, it's entirely possible (and relatively simple!) to store an encrypted version of that same unique identifier code, for an added layer of security, without having to migrate your database management system or even your existing unique identifier pattern. That's what this tool is for. 

This tool is open source and ready for testing in the field.

## How to use Cloak:

1. An administrator generates a key file and determines a password, and then passes both along to staff. Best practice would be to keep the key file offline, and to store the password only in secure places (such as a password manager - my preferred app for this is <a href="https://bitwarden.com">BitWarden</a>). Passphrases (a random string of words) with numbers and/or symbols in between might be especially good for this use case - they're pretty difficult to crack, but also a lot easier to remember than a string of random characters.

2. Staff keep Cloak open in a tab or window while they work. Then, rather than entering in UIDs directly into your data management system, they'd enter them in on the Cloak webpage and use that to generate the encrypted version. The Cloak website will copy that encrypted password into the staff member's clipboard, which can then be pasted into the data management system. (Anyone evaluating this approach may want to add this as a new column, before taking the dive of replacing all of your UIDs in your database).

## How it works:

_Nothing you'd need to know as an admin or end user, but for the sake of disclosure:_

### Symmetric Encryption Using AES-GCM:
The method employs Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM), which is a symmetric key algorithm. This means the same key is used for both encrypting and decrypting data.

AES-GCM provides both confidentiality and data integrity. It encrypts data while simultaneously generating an authentication tag. This tag is used to verify the integrity and authenticity of the data during decryption, making the process secure against tampering.

### Key Derivation Using PBKDF2:
PBKDF2 (Password-Based Key Derivation Function 2) is used to derive a cryptographic key from a password or passphrase input by the user. This function is designed to make attacks on the password harder, using mechanisms such as key stretching.

The key derivation includes the use of a salt (a random value) to ensure that the output keys are unique even if the same password is reused across different installations or users. The use of salt also helps to thwart rainbow table attacks.

The process involves many iterations of a hashing algorithm (SHA-256 in this case), which slows down brute-force attacks by making each attempt to crack the password computationally expensive.

### Secure Key Handling and Storage:
Keys are never stored directly as plain text but are derived on-the-fly using the entered password and stored salt. This approach minimizes the risk of key compromise.

The system uses sessionStorage for storing sensitive data temporarily during the session. This storage is cleared automatically when the session ends (e.g., when the browser is closed), which helps protect against persistent attacks on stored data.

## What's next

Well, I'm certainly curious to see what staff and admin at SSPs think of this approach! So, gathering feedback and ideas is the first step. Feel free to <a href="mailto:michael@cool.industries">contact via email</a> if you have any thoughts or ideas, or if you're a github user please feel free to use the issue reporting system.

Some features I think would probably be helpful in adopting this system long-term: a way to batch update your database with encrypted UIDs, a way to regularly migrate to new key file & password combinations, native integration with some commonly used platforms (ie Excel, Google Sheets, Redcap). So if you're interested in commissioning or collaborating on any new features, again <a href="mailto:michael@cool.industries">please get in touch</a>! :)