# Anti Social Social Club Crawler

Stupid little script.

Requests shop.antisocialsocialclub.com, checks if any items aren't sold out. If there are any available items, an email notification is sent to the first argument.

## Installation

### Requirements

* sendmail in `/usr/sbin/sendmail`
* [node.js](https://nodejs.org/) > 6

```
git clone https://github.com/Kriegslustig/assc-crawly.git
cd assc-crawly
npm install
```

## Usage

```
node . 'superman@example.com'
```

### Works best with crond

To install a cronjob that executes this script add this line:

```
0 * * * * [path/to/assc-crawly]/index.js '[your-mail-address@example.com]'
```

* `[path/to/assc-crawly]` should be replaced to the path where you cloned the repo.
* `[your-mail-address@example.com]` should be replaced with a mail address that whitelists mails from `assc-crawly@*.local`.
