const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000
app.get('/getData', async (req,res) => {
    try {

        const getData = await axios.get('https://interview.adpeai.com/api/v2/get-task');
        let tempArray = [];
        let filterData = getData?.data?.transactions.filter((Element) => {
            const getDate = new Date().getFullYear()-1;
            const currentDate = new Date(Element?.timeStamp).getFullYear();
            if((currentDate === getDate) && Element.type.toLowerCase() === "alpha".toLowerCase()) {
                return Element;
            }
        });
        const maxObject = filterData.reduce((max, obj) => (obj.amount > max.amount ? obj : max), filterData[0]);
        if(maxObject)  tempArray.push(maxObject.transactionID);
        const updateData = await axios.post('https://interview.adpeai.com/api/v2/submit-task',{
            "id": getData?.data?.id,
            "result": tempArray
        });
        res.send(updateData);
    } catch(err) {
       console.log(err);
        res.send("faied")
    }


})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });