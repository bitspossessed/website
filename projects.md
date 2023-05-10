---
---

# Projects

<div class="container-medium">
  <div class="grid-container grid-container-2-rows">
    {% for project in site.projects %}
    <div class="grid-item">
      {{ project.link }}
    </div>
    {% endfor %}
  </div>
</div>
