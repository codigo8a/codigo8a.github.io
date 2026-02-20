---
    layout: null
---
var postsData = [
    {% for post in site.posts %}{
    "title": { { post.title | jsonify } },
    "url": "{{ post.url | relative_url }}",
        "date": "{{ post.date | date_to_string }}",
            "tags": { { post.tags | jsonify } },
    "category": { { post.category | jsonify } }
} {% unless forloop.last %}, {% endunless %}
{% endfor %}
];
