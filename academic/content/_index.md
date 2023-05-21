---
# Leave the homepage title empty to use the site title
title:
type: landing

sections:
  - block: about.biography
    id: about
    content:
      title: Biography
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
  - block: contact
    id: contact
    content:
      title: Contact
      contact_links:
        - icon: at
          icon_pack: fas
          name: pedro.carrott@tecnico.ulisboa.pt
          link: "mailto:?subject={title}&body={url}"
    design:
      columns: '2'
---