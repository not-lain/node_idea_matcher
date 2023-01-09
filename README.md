# node_idea_matcher

### how to install dependencies :
*   *   install node
*   *   cd into project
*   *   `npm install`

### how to run :
```
npm start
```
open : http://localhost:3000

### how to build a docker image

```
docker build -t my-node-app .
```
### how to run from docker image 
```
docker run -d -p 3000:3000 my-node-app
```

### how to stop the docker image 
find `CONTAINER_ID` with the first command then stop your container
```
docker container ls
docker stop [CONTAINER_ID]
```

