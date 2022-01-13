const https = require('https')
const fs = require('fs')
const ical = require('node-ical')

const { parse } = require('dotenv')
require('dotenv').config()

const ejs = require('ejs')

const express = require('express')

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static(__dirname + '/public/'))  

port = 80

app.listen(port, () =>{
    console.log(`Démarrage du superbe site http://127.0.0.1:${port}`)
})

app.get('/', async (req, res) =>{
    const liste = await main()
    res.render(`${__dirname}/public/index.ejs`, {
        affaires : liste
    })
})

const url = process.env.URL

const date = new Date()
const jour = date.getDate()+1
const mois = date.getMonth()+1
const annee = date.getFullYear()

const affaires = {
    'FRANCAIS':'Classeur de Francais',
    'ALLEMAND':'Cahier d\'Allemand et Cahier de vocabulaire',
    'MATHEMATIQUES':'Cahier d\'Allemand et Cahier de vocabulaire',
    'ALLEMAND':'Cahier d\'Allemand et Cahier de vocabulaire',
    'JOUVELOT':'Pochette jaune d\'enseignement scientifique',
    'HISTOIRE':'Cahier d\'Histoire',
    'PHYSIQUE':'Lutin noir de Physique',
}

const convert_mois = {
    1:'Jan',
    2:'Feb',
    3:'Mar',
    4:'Apr',
    5:'May',
    6:'Jun',
    7:'Jul',
    8:'Aug',
    9:'Sep',
    10:'Oct',
    11:'Nov',
    12:'Dec',
}


const full2 = `${convert_mois[mois]} ${jour.toString()}`

async function main(){

    let fdp = []

    console.log('================================')
    console.log('-- requete en cours à pronote --')
    const events = await ical.async.fromURL(url)
    console.log('-- fin de la requete --')
    console.log('================================')
    for (const [key, value] of Object.entries(events)) {
        if(key.includes('Cours')){
            let date = value['start'].toString()
            if(date.includes(full2)){
                let matiere = value['summary']['val']
                for (const [_key, _value] of Object.entries(affaires)){
                    if(matiere.includes(_key)){
                        fdp.push(_value)
                    }
                }
            }
        }
    }
    return fdp    
}