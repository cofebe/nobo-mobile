install:
	npm install
	npm install -g @ionic/cli

build: install
	npm run build

run: build
	npm run start

ios-build:
	ionic capacitor copy ios

ios-run:
	ionic capacitor run ios -l --external --prod

ios-open:
	ionic capacitor open ios

android-build:
	#npm run build
	#npx cap sync
	ionic capacitor build android
	ionic capacitor copy ios

android-run:
	npx cap open android
