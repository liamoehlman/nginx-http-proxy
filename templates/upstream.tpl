{{#each route}}
upstream {{this.source}} { 
    {{#each this.hosts}}server {{this}};
    {{/each}}
}
{{/each}}