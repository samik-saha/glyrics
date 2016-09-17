for file in $(find glyrics-ext -type "f" ); do
    
    outfile="publish/$file"
    
    if [[ $file == *.js ]] && [[ $file != *.min.js ]]; then
        echo Compiling $file to $outfile
        java -jar closure-compiler.jar --compilation_level SIMPLE --js $file --js_output_file $outfile
    else
        echo Copying $file to $outfile
        cp --parents $file publish
    fi
done