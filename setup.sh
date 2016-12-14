#!/bin/bash

echo Cleaning...
rm -rf ./dist

# Install the Node modules for the server and client
npm install
cd client/
npm install
cd ..

# Create Git hash and URL environment variables
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GIT_URL=$(git config --get remote.origin.url)
fi

# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)


echo Building app
npm run build

# Error checking
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm build failed with exit code " $rc
    exit $rc
fi

# Setup the dist folders
mkdir dist
mkdir dist/public

# Write the Git hash into a file
cat > ./dist/githash.txt <<_EOF_
$GIT_COMMIT
_EOF_

# Write a small webpage which contains version information
cat > ./dist/public/version.html << _EOF_
<!doctype html>
<head>
   <title>App version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GITHUB_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GITHUB_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_

# Write the Git hash into environment file for Docker compose
echo "GIT_COMMIT=$GIT_COMMIT" > .env

cp ./Dockerfile ./build/

#cd dist
echo Building docker image

# Build the docker image
docker build -t birgirob/tictactoe:$GIT_COMMIT -t birgirob/tictactoe:latest .

# Error checking
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi

# Push the images
echo Pushing docker images

docker push birgirob/tictactoe:$GIT_COMMIT
docker push birgirob/tictactoe:latest

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

echo "Done"
