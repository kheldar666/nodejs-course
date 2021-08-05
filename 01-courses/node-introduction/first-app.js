const fs = require('fs')

fs.writeFileSync('notes.txt','Hello my name is Martin.\n')

fs.appendFileSync('notes.txt','I was born in mexico in 1974.\n')