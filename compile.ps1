$files = Get-ChildItem -Path "glyrics-ext" -Recurse|Where-Object{!($_.PSIsContainer)}
for ($i=0; $i -lt $files.Count; $i++) {
    $infile = Resolve-Path -Path $files[$i].FullName -Relative
    
    $outfile = "publish\" + $infile
    if( $infile -match "\.js$" -and $infile -notmatch "\.min.js$"){
        echo "Compiling $infile to $outfile"
        java -jar closure-compiler.jar --compilation_level SIMPLE --js $infile --js_output_file $outfile
    }
    else{
        echo "Copying $infile to $outfile"
        cp $infile $outfile
    }
}
echo "Done!"