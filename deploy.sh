# Deploy on Heroku

git checkout build
git merge master
## Build client
cd client
npm i
npm run build

cd ../
## make build commit
git add ./server/public/
git commit -m 'build' -n

## make build commit
git subtree split -P server -b heroku-deploy
git push -f heroku heroku-deploy:master
git branch -D heroku-deploy

git checkout master
