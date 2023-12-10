---
# Leave the homepage title empty to use the site title
title: Personal
type: landing

gallery_item:
- album: dogs
  image: 1-tea.jpg
  caption: 'My first dog, Tea :female_sign:'
- album: dogs
  image: 2-ruby.jpg
  caption: 'My current dog, Ruby :female_sign:'

sections:
  - block: markdown
    content:
      title: ':carrot: About me'
      text: |-
        <center>I am a Portuguese and British citizen, born in 1999 in Évora, Portugal. This page contains some personal information about myself and what I enjoy doing in my free time. Below, I leave pictures of the cutest woofers to lay their paws on Earth.</center>
        <br>
        {{< gallery album="dogs" >}}
  - block: markdown
    content:
      title: ':soccer: Football'
      text: I enjoy a good game of football, which is why I support SL Benfica :eagle:! My favourite English side is Manchester United and I am also fond of AC Milan (for no particular reason). Considering the main color of these teams, supporters of rival teams might consider my taste a red flag...
    design:
      columns: '2'
  - block: markdown
    content:
      title: ':ramen: Animanga'
      text: My favourite entertainment mediums are anime and manga. Check out my profile in [MyAnimeList](https://myanimelist.net/profile/Carrott_99), if you wish to become a more cultured person. Occasionally, I still enjoy reading books or watching movies/series for variety's sake. Feel free to add me on [GoodReads](https://www.goodreads.com/user/show/104915806-pedro-carrott) and [Letterboxd](https://letterboxd.com/carrott/).
    design:
      columns: '2'
  - block: markdown
    content:
      title: ':mahjong: Mahjong'
      text: |-
        At home, I have a Mahjong set to play the Hong Kong variant of the game with friends and/or family. However, although it's fun to mess around with the physical tiles, I mostly play Riichi Mahjong online in [MahjongSoul](https://mahjongsoul.yo-star.com/).

        > *Mahjong is amazing. No matter how good I am, I may still lose; no matter how bad I play, I may still win.*
        <div style="text-align: right"> &mdash; Miki Nikaidou </div>
    design:
      columns: '2'
  - block: markdown
    content:
      text: <center>{{< spoiler text="Click to view" style="color:white" >}}{{< figure src="rickroll.gif" width="20%" >}}{{< /spoiler >}}</center>
    design:
      columns: '2' # just to make image smaller
      background:
        image: 
          filename: elmo.jpg
          parallax: true # not working on mobile :/
          filters:
            brightness: 0.6
      spacing:
        padding: ["20px", "0", "0", "0"]
---
