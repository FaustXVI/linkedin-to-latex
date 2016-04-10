# linkedin-to-latex

Transform a linkedIn HTML to a tex file (a makefile is included in order to generate .pdf file)

## Prerequises

You'll need to have moderncv in your tex environment.

To get the other dependencies :
```
npm install
```

## Usage

For now, save your cv from linkedin and change the filename in `html2Latex.js` then :
```
node html2Latex.js > cv.tex && make && make clean
```

you now have a `cv.tex` and `cv.pdf` on your file system.

## Customize

Change the file `cv.tex.template` or directly the generated `cv.tex`
