---
title: 'Slides: Formal Specification and Verification of the Lazy JellyFish Skip List'
authors: []
tags: []
categories: []
date: '2022-02-05'
slides:
  theme: light
  highlight_style: dracula
---

### **Formal Specification and Verification of the Lazy JellyFish Skip List**
#### MSc Thesis Defense

<br>

Pedro Carrott --- *IST, University of Lisbon*

**Advisor:** João Ferreira --- *IST, University of Lisbon*

<span class="footer"> Press the `S` key to view the speaker notes </span>

{{< speaker_note >}}

Hello. I am Pedro Carrott and today I'm presenting my MSc thesis on the formal verification of the Lazy JellyFish Skip List, a lock-based variant of the original JellyFish, which implements a concurrent append-only map.

{{< /speaker_note >}}

---

<section>

## Introduction

<sup> (continue below) </sup>

---

### Concurrent Maps

Concurrent maps are used by data store applications to index data efficiently

Most data stores record the value history of each key, rather than delete old values

{{< speaker_note >}}

Maps provide an abstraction for a collection of key-value pairs; this is a useful abstraction for applications such as data stores, which require efficient structures to index data.

In fact, most of these applications maintain a history of values for each key in the map, so as to record different versions of the same data, instead of deleting outdated information.

{{< /speaker_note >}}

---

### The JellyFish Skip List

The skip list is the most widely used map implementation by these applications

JellyFish extends traditional skip lists by associating a list of timestamped values to each key

{{< speaker_note >}}

The most widely used implementation for such concurrent append-only maps is the skip list, since it makes use of a probabilistic strategy to avoid bottlenecks witnessed in concurrent trees, for example.

JellyFish is a state-of-the-art implementation for concurrent append-only skip lists, which extends the traditional skip list data structure by storing a linked list in each node to reflect the history of values associated to its key.

{{< /speaker_note >}}

---

### Iris

We verify a variant of JellyFish using the concurrent separation logic of [Iris](https://iris-project.org/).

We formalize the argmax resource algebra to define the protocol for concurrent updates

The Coq formalization is [publicly available](https://github.com/sr-lab/iris-jellyfish)

{{< speaker_note >}}

In this work, we verify the functional correctness of a lock-based variant of JellyFish using Iris, a state-of-the-art concurrent separation logic.

To reason about the protocol for concurrent updates to the map, we have formalize a resource algebra for the argmax operator.

All results are mechanized in Coq and available in GitHub.

{{< /speaker_note >}}

---

### Contributions

{{< fragment >}}
- The first verification effort of the JellyFish design
{{< /fragment >}}

{{< fragment >}}
- A new concurrent map specification with version control
{{< /fragment >}}

{{< fragment >}}
- A mechanized proof that our implementation satisfies the specification
{{< /fragment >}}

{{< fragment >}}
- A novel resource algebra for the argmax operation
{{< /fragment >}}

{{< speaker_note >}}

The contributions of this work can thus be summarized as follows:
- The first verification effort of the JellyFish design for concurrent append-only skip lists
- A new concurrent map specification, which supports version control through the use of timestamps
- A mechanized proof that our skip list implementation satisfies the concurrent map specification
- A novel resource algebra in the concurrent separation logic of Iris for the argmax operation

{{< /speaker_note >}}

</section>

---

<section>

## Skip Lists

<sup> (continue below) </sup>

{{< speaker_note >}}

We begin by looking at how skip lists can be used to perform efficient key searches, as well as how concurrent updates can be done to the data structure through version control mechanisms.

{{< /speaker_note >}}

---

### Overview

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  A skip list contains two sentinel nodes with keys MIN and MAX, linked in HMAX lists
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Each list is a sublist of its lower level and all lists are sorted by key
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  Elements can be skipped by searching the lists in the higher levels
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  {{< figure src="images/empty.svg" >}}
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  {{< figure src="images/skip.svg" >}}
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  {{< figure src="images/skip1.svg" >}}
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  {{< figure src="images/skip2.svg" >}}
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  {{< figure src="images/skip3.svg" >}}
  {{< /fragment >}}

  {{< fragment >}}
  {{< figure src="images/skip4.svg" >}}
  {{< /fragment >}}
</div>

{{< speaker_note >}}

The skip list is initialized with two sentinel nodes with keys MIN and MAX, defining the valid key range for the structure.

The left sentinel contains an array of HMAX entries, each pointing to the right sentinel, initializing HMAX empty linked lists.

As new keys are inserted to the skip list, each list must always remain a sublist of the list directly below it, while the bottom list should contain all keys which have been inserted.

Since each level contains progressively fewer elements of the bottom list, maintaining all lists sorted allows searches in higher levels to skip elements that would otherwise be traversed in a standard linear search.

Consider the figure example: we begin the search for key 17 in the left sentinel at the top level and check that its successor holds key 13.

Since 13 is lower than 17, key 17 can only be found after key 13, making it safe to skip key 5.

We then check the successor of key 13 at the top level and see that MAX if greater than 17; as such, we cannot skip any keys between them, since key 17 might be one of them.

We then continue the search in the next level and repeat the same steps: since the new successor holds key 24, we continue to the next level and reach the bottom list, where the successor now holds key 17 concluding the search.

If the key is not found upon reaching the bottom level, then we can conclude that it does not belong to the skip list; otherwise, the search can stop in any level, as soon as the key is found.

{{< /speaker_note >}}

---

### JellyFish

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  The JellyFish skip list implements a map, storing key-value pairs
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Each node contains a <i>vertical list</i>, a timeline with timestamped values
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  To append a new value, the timestamp must be <i>at least as recent</i> as the head's
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
  {{< figure src="images/jelly5.svg" >}}
{{< /fragment >}}

{{< speaker_note >}}

As skip lists allow certain keys to be skipped during traversal, this data structure can be used as a map implementation storing key-value pairs.

The JellyFish design keeps in each node a list of values, referred to as a vertical list, representing the timeline of values associated to the key, tagging each value with a given timestamp.

As we see with key 17, the most recent value from timestamp 3 is found at the head of its vertical list, while its predecessor value is from a less recent timestamp 1.

The timeline retains its consistency by never appending new values to a vertical list if the new timestamp is less recent than the timestamp found at the head.

Accordingly, if two updates are executed on the same key with the same timestamp, then both values are appended to the vertical, as we see in key 5.

{{< /speaker_note >}}

---

### Concurrent Updates

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  Updating threads employ lazy synchronization through locks
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  Traversal is done until the bottom, locking the key's predecessor
  {{< /fragment >}}

  {{< fragment weight=3 class=fade-in >}}
  {{< fragment weight=6 class=fade-out >}}
  If the key does not exist, then a new node is linked to a random number of levels
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  Insertions are done bottom-up to maintain the sublist relation
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  Updates follow the same initial steps, locking the key's predecessor 
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  If a node already exists for the key, then the new value will be appended to the vertical list
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  {{< figure src="images/jelly1.svg" >}}
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  {{< figure src="images/jelly2.svg" >}}
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  {{< figure src="images/jelly3.svg" >}}
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  {{< figure src="images/jelly4.svg" >}}
  {{< /fragment >}}

  {{< fragment weight=5 class=fade-in >}}
  {{< fragment weight=7 class=fade-out >}}
  {{< figure src="images/jelly5.svg" >}}
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  {{< figure src="images/jelly6.svg" >}}
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  {{< figure src="images/jelly7.svg" >}}
  {{< /fragment >}}
</div>

{{< speaker_note >}}

To ensure that concurrent updates to the data structure alter the state safely, the put operation employs a lazy synchronization strategy using locks.

An thread trying to insert key 24 will first traverse the skip list until the bottom level to find its predecessor in key 17 and acquires the node's lock in the bottom level.

Since the key has not been found, a new node is created with some random height, which in this case we assume to be 2.

As the predecessor's lock has been acquired, we can replace its successor by linking the new node to the bottom level.

The lock can then be released and the node can be inserted in the upper level; insertions are performed bottom-up so as to ensure that the sublist relation is preserved.

The node is not inserted in any other level, as that would surpass its intended height, which concludes the put operation.

A following update on key 24 will repeat the same initial steps by traversing the skip list until the bottom level and locking its predecessor.

As the node already exists it will append a new value to its vertical, as long as the timestamp is more recent than 3.

In other words, claiming a node's lock grants exclusive access to update the node's successor at the lock's level, while the bottom level lock also allows updates to the value of the node's successor.

{{< /speaker_note >}}

</section>

---

<section>

## Reasoning about Timestamped Domains

<sup> (continue below) </sup>

{{< speaker_note >}}

Having seen how the data is organized in memory, we now abstract from the concrete implementation and discuss how we can use Iris to reason about concurrent maps with timestamped values.

{{< /speaker_note >}}

---

### Ghost state in Iris

{{< fragment >}}
  <span class="ghost"> 
  $a$
  </span> $^{^{\ \gamma}} $
  {{< /fragment >}}

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Resource Algebras

<div class="r-stack">
  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $a$
  </span> $^{^{\ \gamma}} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f \cdot a^\prime$
  </span> $^{^{\ \gamma}} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f$
  </span> $^{^{\ \gamma}} $
  $*$
  <span class="ghost"> 
  $a^\prime$
  </span> $^{^{\ \gamma}} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f$
  </span> $^{^{\ \gamma}} $
  $*$
  <span class="ghost"> 
  $a^\prime \cdot x$
  </span> $^{^{\ \gamma}} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f \cdot a^\prime \cdot x$
  </span> $^{^{\ \gamma}} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $a \cdot x$
  </span> $^{^{\ \gamma}} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Map Composition

<div class="r-stack">
  {{< fragment class=current-visible >}}
  $ \\{ \ k_1 : x \ \\} \cup \\{ \ k_2 : y \ \\} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  $ \\{ \ k : x \ \\} \cup \\{ \ k : y \ \\} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  $ \\{ \ k : x \cdot y \ \\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Value Composition

<div class="r-stack">
  <p class="fragment current-visible">
  $ (a, i) \cdot (b, j) = (b, j) $
  </p>

  <p class="fragment current-visible">
  $ (a, i) \cdot (b, i) = (a \cup b, i) $
  </p>

  <p class="fragment">
  $ (a, i) \cdot \textsf{botZ} = (a, i) $
  </p>
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

# Thank you!

{{< speaker_note >}}

{{< /speaker_note >}}