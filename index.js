const https = require('https')
const fs = require('fs')
const ical = require('node-ical')

const { Webhook } = require('discord-webhook-node')

const { parse } = require('dotenv')
require('dotenv').config()

// const ejs = require('ejs')

// const express = require('express')

// const app = express()

// app.set('view engine', 'ejs')

// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

// app.use('/', express.static(__dirname + '/public/'))  

// port = 80

// app.listen(port, () =>{
//     console.log(`Démarrage du superbe site http://127.0.0.1:${port}`)
// })

// app.get('/', async (req, res) =>{
//     const liste = await main()
//     res.render(`${__dirname}/public/index.ejs`, {
//         matin : liste['matin'],
//         apres_midi : liste['apres_midi']
//     })
// })

// variables .env
const url = process.env.URL
const webhook_url = process.env.WEBHOOK

const date = new Date()
const jour = date.getDate()+1
const mois = date.getMonth()+1
const annee = date.getFullYear()

const affaires = {
    'FRANCAIS':'Classeur de Francais',
    'ANGLAIS':'Pochette rouge d\'anglais',
    'ALLEMAND':'Cahier d\'Allemand et Cahier de vocabulaire',
    'MATHEMATIQUES':'Cahier de mathématiques',
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

async function envoieDiscord(){
    const liste = await main()
    const message = `Bonjour <@482590876028370966> 👋,\nVoici les affaires qu'il te faut pour la journée 🎒:\n\n__Affaires pour la **matinée**__ :\n-${liste['matin'].join('\n-')}\n\n__Affaires pour l'**après midi**__ :\n-${liste['apres_midi'].join('\n-')}.\n\nPassse une bonne journée !`
    const hook = new Webhook(webhook_url)
    hook.setUsername('Que mettre dans son sac ?')
    hook.send(message)
}

envoieDiscord()

const full2 = `${convert_mois[mois]} ${jour.toString()}`

async function main(){

    let matin = []
    let apres_midi = []

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
                    if(matiere.includes('ANNUL')){
                        break
                    }
                    if(matiere.includes(_key)){
                        if(value['start'].getHours()<13){
                            matin.push(_value)
                        }
                        else{
                            apres_midi.push(_value)
                        }
                    }
                }
            }
        }
    }
    return {
        'matin':matin, 
        'apres_midi':apres_midi
    }
}