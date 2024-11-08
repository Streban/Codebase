const fs = require('fs');
let data = []
for(let i =0;i<1000;i++){
data.push(`"a${i}@yopmail.com"`)
}

fs.writeFile('outputfile.txt',`${data}`,(err,data)=>{
if(err){console.log(err)}
console.log('successfull!')
}
);