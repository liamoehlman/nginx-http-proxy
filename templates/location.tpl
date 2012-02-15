{{#each route}}
location /{{this.source}} {
    proxy_pass http://{{this.source}}/{{this.source}};
}
{{/each}}