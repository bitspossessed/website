---
---

# Projects

<div class="container-medium">
  <div class="grid-item grid-item-mb">
    We are especially interested to work on projects that involve some or all of the following:
    <ul>
      <li>Activism</li>
      <li>Art</li>
      <li>Political perspectives</li>
      <li>Community-focused technology</li>
      <li>p2p and mesh-networks</li>
      <li>Open source</li>
    </ul>
  </div>
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
