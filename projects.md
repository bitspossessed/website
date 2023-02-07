---
---

# Projects

<div class="grid-container grid-container-projects">
  {% for project in site.projects %}
  <div class="grid-item">
    {{ project.title }}
  </div>
  {% endfor %}
</div>
