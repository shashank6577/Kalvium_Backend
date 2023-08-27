const express  = require('express');
const app = express(); 
const port = 3000;

const history = [];

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
        res.json({question : mathExp, answer }); 

    } catch(err){
        res.json({err : 'Invalid expression'});
    }
});

app.listen(port,()=>{
    console.log("Server running on port 3000");
});