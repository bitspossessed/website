---
---

# Projects

<div class="container-medium">
  <div class="grid-container grid-container-1-column">
    {% for project in site.projects %}
    <div class="grid-item">
      {{ project.link }}
      <br>
      <span>{{ project.text }}</span>
    </div>
    {% endfor %}
  </div>
</div>
