const express  = require('express');
const fs = require('fs'); 
const app = express(); 
const port = 3000;

let history = [];

try{
    const data = fs.readFileSync('history.json','utf8'); 
    history = JSON.parse(data); 
}catch(err){
    console.log("No existing history found"); 
}

app.get('/', (req,res) =>{
    res.send(`
        <h1>Available Endpoints</h1>
        <ul>
            <li><code>/history</code> : Lists the last 20 operations performed on the server</li>
            <li><code>/3/plus/5</code> : Performs the operation 3+5 and returns the JSON</li>
            <li><code>/3/minus/5</code> : Performs the operation 3-5 and returns the JSON</li>
        </ul>
    `);
});


app.get('/history', (req,res)=>{
    res.json(history);
});


app.get('/*', (req,res) => {
    const expression = req.params[0].split('/');
    let mathExp = '';

    for(let i = 0; i < expression.length; i++){
        if(expression[i] === 'plus')
            mathExp += '+';
        else if (expression[i] === 'minus')
            mathExp += '-';
        else if (expression[i] === 'into')
            mathExp += '*';
        else if (expression[i] === 'by')
            mathExp += '/';
        else 
            mathExp += expression[i];
    }

    try{
        const answer = eval(mathExp); 

        history.push({question : mathExp, answer}); 
        if(history.length > 20){
            history.shift(); 
        }
        fs.writeFileSync('history.json',JSON.stringify(history));
        res.json({question : mathExp, answer }); 

    } catch(err){
        res.json({err : 'Invalid expression'});
    }
});

app.listen(port,()=>{
    console.log("Server running on port 3000");
});