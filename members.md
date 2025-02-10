---
---

# Members

<div class="grid-container">
  {% for member in site.members %}
    <div class="grid-item">
      <div class="container-content">
        {{ member.name }}
      </div>
      <div class="container-content">
        {{ member.image }}
      </div>
      <div class="container-content">
        {{ member.sentences }}
      </div>
      <div class="container-content">
        {{ member.links }}
      </div>
    </div>
  {% endfor %}
</div>
<h2 class="h2-margin-top">Former members</h2>
<div class="grid-container">
  {% for member in site.formerMembers %}
    <div class="grid-item">
      <div class="container-content">
        {{ member.name }}
      </div>
      <div class="container-content">
        {{ member.image }}
      </div>
      <div class="container-content">
        {{ member.sentences }}
      </div>
      <div class="container-content">
        {{ member.links }}
      </div>
    </div>
  {% endfor %}
</div>
