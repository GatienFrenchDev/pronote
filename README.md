# Bot SMS pour les affaires pour le lendemain

Cette application Node permet d'envoyer un SMS contenant les affaires qu'il faut apporter pour demain.

Pour envoyer les SMS j'utilise l'API gratuite d'**infobip**. Pour récupérer les cours du lendemain j'utilise le lien .ics disponible sur mon **ENT pronote**.

L'application est hebergé sur Heroku et se lance à l'aide d'une requete GET envoyé à l'aide du site cron-job.prg

![IMG_0274](https://user-images.githubusercontent.com/80203026/162637763-b137857a-6640-41b8-aac3-4a752fa5ebba.PNG)
