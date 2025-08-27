// function counte(){
//     let count =0;

//     return {
//         increment : ()=>{
//           count++;
//           return count;
//         },
//         decrement : ()=>{
//           count--;
//           return count;
//         },
//         display : ()=>{
//             let msg = `count is ${count}`
//            return msg;
//         },
//     }
// }
// let counter = counte();
// console.log(counter.increment())
// console.log(counter.increment())
// console.log(counter.display())

// setTimeout(()=>{
//     console.log("timeout");
// },2000);

// setInterval(()=>{
//     console.log("interval");
// },2000);

let num = [1,2,1,1,1];
let nu = num.reduce((acc,curr)=>{
   return acc+curr;
},0);
console.log(nu)

let ori = {
   name : "farhan",
   age : 21,
   skills : { 
      java : "good",
      spring : "bad"
   }
}

let shallowcopy = {...ori};

shallowcopy.age=22;
shallowcopy.skills.java = "bad";

console.log(`original is ${JSON.stringify(ori,null,2)}`)
console.log(`copy is ${JSON.stringify(shallowcopy,null,2)}`)

let deepcopy = structuredClone(ori);

deepcopy.age=25;
deepcopy.skills.java = "deep";

console.log(`original is ${JSON.stringify(ori,null,2)}`)
console.log(`copy is ${JSON.stringify(deepcopy,null,2)}`)

