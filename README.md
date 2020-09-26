# Techcolon Editor - v.0.0.1
The Techcolon editor acts as a custom text editor for writing blog posts specifically for the techcolon blog on the fly.
The editor converts the text written to HTML for web compatibility. This is seen when you preview the blog post in the application.
Using the same stylesheet as the techcolon blog, styles applied to the available web components are presented as is on the blog.
The introduction of custom symbols allow for no prior knowledge of coding which makes it easy for anyone and everyone to use the editor.
The editor itself is based on Regular Expressions. Plans are to make it integration compatible but here's the standalone version.
The most important thing to note are the symbols used to acheive the intended markup.

### Headings
##### Level One Heading (H1)
The text is to be wrapped around ``~#1``. An example would be
```
~#1 <Heading> ~#1
```