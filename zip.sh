echo "Chrome"
zip extension.zip *.js manifest.json *.png data/*.js data/*.css data/*.png data/*.gif
echo "Firefox (please be in the SDK shell)"
cfx xpi --force-mobile
