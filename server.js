// new features
// empty fields shouldn't be included in the calculations
// top 3 most similar ideas
n_similars = 3

const express = require('express')
const xlsx = require('node-xlsx');
const stringSimilarity = require('string-similarity');
const app = express()
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('myindex')
})
app.get('/manual', (req, res) => {
    res.render('mymanual')
})


app.post('/', (req, res) => {
    let new_data = {}
    for (const element in req.body) {
        new_data[element] = req.body[element]
    }
    let out = MostSimilarNewData(new_data);
    key_columns = Object.keys(new_data);
    res.render('myindex', { new_data: new_data, out: out, n_similars: n_similars })
})

app.post('/manual', (req, res) => {
    let new_data = {}
    for (const element in req.body) {
        if (req.body[element] !=''){
            new_data[element] = req.body[element]
        }
        
    }
    let out = MostSimilarNewData(new_data);
    key_columns = Object.keys(new_data);
    res.render('mymanual', { new_data: new_data, out: out, n_similars: n_similars })
})


app.listen(3000);
console.log('Server started at http://localhost:' + 3000);



















// Load the Excel file
const workbook = xlsx.parse('./Example of the original database.xlsx');

// Get the first sheet
const sheet = workbook[0];

// Get the rows of the sheet
const rows = sheet['data'];


// columns of our data
let columns = rows[0].slice(0, 11)
// columns = [
//   'First Name',
//   'Last Name',
//   'Employee Name',
//   'Title',
//   'Type',
//   'Sector',
//   'Key words',
//   'Problem/Opportunity',
//   'Description',
//   'Added Value',
//   'Impact'
// ]
// let key_columns = ["Key words", "Title", "Description"]


//initialising the data
let d_nums = {} // d_nums contaisn the number of each column 
let d = {} // d contaisn the data
for (const col_num in columns) {
    d_nums[col_num] = columns[col_num]
    d[columns[col_num]] = []
}


// filling the data in d
for (const row of rows.slice(1)) {
    for (let col_num = 0; col_num < 11; col_num++) {

        var col_name = d_nums[col_num]
        try {
            var value = row[col_num]
        } catch (error) {
        }
        if (value === undefined) {
            value = 'None'
        }
        d[col_name].push(value)
    }
}

let n = d['Employee Name'].length //length of our data









// similarity coeff to a certain line to new_data
function DataSimilarityNewData(new_data) {
    let d_sims = { 'Employee Name': [], 'sims': [] }
    for (let j = 0; j < n; j++) {
        {
            var s = 0;
            for (let column in new_data) {
                let similarity = stringSimilarity.compareTwoStrings(d[column][j], new_data[column]);
                s = s + similarity;
            }
            d_sims['Employee Name'].push(d['Employee Name'][j]);
            key_columns = Object.keys(new_data);
            d_sims['sims'].push(s / key_columns.length);
        }
    }
    return d_sims
}



// most similar to new data
function MostSimilarIndexNewData(new_data) {
    // returns index of the line of the most similar idea
    let d_sims = DataSimilarityNewData(new_data);
    let sims = d_sims['sims']
    let biggest_sims = sims.sort((a, b) => b - a).slice(0, n_similars);
    console.log("most similar coefficients: ")
    let indexs = []
    for(const i of biggest_sims){
        console.log(i);
        indexs.push(sims.indexOf(i));
    }
    return indexs;
}


// final data
function MostSimilarNewData(new_data) {
    // returns most similar idea
    let indexes = MostSimilarIndexNewData(new_data);
    out = {}
    for (const column in d) {
        out[column] = []
    }

    for (const column in d) {
        for(index of indexes){
            out[column].push(d[column][index])
        }
    }
    return out;
}

