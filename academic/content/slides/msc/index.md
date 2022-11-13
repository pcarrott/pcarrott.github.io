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
- A novel resource algebra for the $\textsf{argmax}$ operation
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
  <img src="images/empty.svg">
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <img src="images/skip.svg">
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <img src="images/skip1.svg">
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <img src="images/skip2.svg">
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <img src="images/skip3.svg">
  {{< /fragment >}}

  {{< fragment >}}
  <img src="images/skip4.svg">
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
<img src="images/jelly5.svg">
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

  {{< fragment weight=3 class=current-visible >}}
  If the key does not exist, then a new node is linked to a random number of levels
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  The lock is released after insertion, locking the predecessor in the next level
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  Insertions are done bottom-up to maintain the sublist relation
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  Updates follow the same initial steps, locking the key's predecessor in the bottom level
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  If a node already exists for the key, then the new value will be appended to the vertical list
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <img src="images/jelly1.svg">
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <img src="images/jelly2.svg">
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <img src="images/jelly3.svg">
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <img src="images/jelly4.svg">
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <img src="images/jelly5.svg">
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <img src="images/jelly6.svg">
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  <img src="images/jelly7.svg">
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

<div class="r-stack">
  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $\varnothing$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost" style="border-color: red"> 
  $\varnothing$
  </span><sup class="name">$ \ {\gamma} $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $\varnothing$
  </span><sup class="name">$ \ \textcolor{red}{\gamma} $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $\varnothing$
  </span><sup class="name">$ \ \gamma $</sup>
  <span class="smath">$*$</span>
  <span class="ghost"> 
  $\varnothing$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $\{ \ 1 \ \}$
  </span><sup class="name">$ \ \gamma $</sup>
  <span class="smath">$*$</span>
  <span class="ghost"> 
  $\{ \ 2 \ \}$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment >}}
  <span class="ghost"> 
  $\{ \ 1, 2 \ \}$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Resource Algebras

<div class="r-stack">
  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $a$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f \cdot a^\prime$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f$
  </span><sup class="name">$ \ \gamma $</sup>
  <span class="smath">$*$</span>
  <span class="ghost"> 
  $a^\prime$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f$
  </span><sup class="name">$ \ \gamma $</sup>
  <span class="smath">$*$</span>
  <span class="ghost"> 
  $a^\prime \cdot x$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  <span class="ghost"> 
  $f \cdot a^\prime \cdot x$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}

  {{< fragment >}}
  <span class="ghost"> 
  $a \cdot x$
  </span><sup class="name">$ \ \gamma $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Map Composition

<div class="r-stack smath">
  {{< fragment class=current-visible >}}
  $ \\{ \ k_1 : x \ \\} \cup \\{ \ k_2 : y \ \\} $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  $ \\{ \ k : x \ \\} \cup \\{ \ k : y \ \\} $
  {{< /fragment >}}

  {{< fragment >}}
  $ \\{ \ k : x \cdot y \ \\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Value Composition

<div class="r-stack smath">
  {{< fragment class=current-visible >}}
  $ (a, i) \cdot (b, j) = (b, j) $
  {{< /fragment >}}

  {{< fragment class=current-visible >}}
  $ (a, i) \cdot (b, i) = (a \cup b, i) $
  {{< /fragment >}}

  {{< fragment >}}
  $ (a, i) \cdot \textsf{botZ} = (a, i) $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## Map Specification

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Map Resources

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ \textsf{IsSkipList}(p, M, q, \gamma) $
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \textsf{IsSkipList}(\textcolor{red}{p}, M, q, \gamma) $
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $ \textsf{IsSkipList}(p, \textcolor{red}{M}, q, \gamma) $
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $ \textsf{IsSkipList}(p, M, \textcolor{red}{q}, \gamma) $
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  $ \textsf{IsSkipList}(p, M, q, \textcolor{red}{\gamma}) $
  {{< /fragment >}}

  {{< fragment weight=6 >}}
  $ \textsf{IsSkipList}(p, M_1 \cup M_2, q_1 + q_2, \gamma) $
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=7 class=current-visible >}}
  $ \downarrow $
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  $ \uparrow $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=7 >}}
  $ \textsf{IsSkipList}(p, M_1, q_1, \gamma) * \textsf{IsSkipList}(p, M_2, q_2, \gamma) $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Triple for constructor

<div class="smath">
  {{< fragment weight=2 class="fade-in" >}}
  $ \left\\{ \ \textsf{True} \ \right\\} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=1 class="fade-in" >}}
  $ \textsf{new} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=3 class="fade-in" >}}
  $ \left\\{ \ p. \ \exists \ \gamma. \ \textsf{IsSkipList}(p, \varnothing, 1, \gamma) \ \right\\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Triple for updates

<div class="smath">
  {{< fragment weight=2 class="fade-in" >}}
  $ \left\\{ \ \textsf{IsSkipList}(p, M, q, \gamma) \ \right\\} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=1 class="fade-in" >}}
  $ \textsf{put} \ p \ k \ v \ t \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=3 class="fade-in" >}}
  $ \left\\{ \ \textsf{IsSkipList}(p, M \cup \\{ \ k : (\\{ v \\}, t) \ \\}, q, \gamma) \ \right\\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Triple for lookups

<div class="smath">
  {{< fragment weight=2 class="fade-in" >}}
  $ \left\\{ \ \textsf{IsSkipList}(p, M, 1, \gamma) \ \right\\} \\\\ $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=1 class="fade-in" >}}
  $ \textsf{get} \ p \ k \\\\ $
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=3 class="current-visible" >}}
  $ \left\\{ \ v^?. \begin{array}{c} \textcolor{red}{\textsf{IsSkipList}(p, M, 1, \gamma)} * ((v^? = \textsf{None} * M[k] = \textsf{None}) \ \lor \\\\ (\exists \ v, S, t. \ v^? = \textsf{Some}(v, t) * M[k] = \textsf{Some}(S, t) * v \in S)) \end{array} \right\\} $
  {{< /fragment >}}

  {{< fragment weight=4 class="current-visible" >}}
  $ \left\\{ \ v^?. \begin{array}{c} \textsf{IsSkipList}(p, M, 1, \gamma) * (\textcolor{red}{(v^? = \textsf{None} * M[k] = \textsf{None})} \ \lor \\\\ (\exists \ v, S, t. \ v^? = \textsf{Some}(v, t) * M[k] = \textsf{Some}(S, t) * v \in S)) \end{array} \right\\} $
  {{< /fragment >}}

  {{< fragment weight=5 class="current-visible" >}}
  $ \left\\{ \ v^?. \begin{array}{c} \textsf{IsSkipList}(p, M, 1, \gamma) * ((v^? = \textsf{None} * M[k] = \textsf{None}) \ \lor \\\\ \textcolor{red}{(\exists \ v, S, t. \ v^? = \textsf{Some}(v, t) * M[k] = \textsf{Some}(S, t) * v \in S)}) \end{array} \right\\} $
  {{< /fragment >}}

  {{< fragment weight=6 >}}
  $ \left\\{ \ v^?. \begin{array}{c} \textsf{IsSkipList}(p, M, 1, \gamma) * ((v^? = \textsf{None} * M[k] = \textsf{None}) \ \lor \\\\ (\exists \ v, S, t. \ v^? = \textsf{Some}(v, t) * M[k] = \textsf{Some}(S, t) * v \in S)) \end{array} \right\\} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## Representation Predicate

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Left Sentinel

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $ \exists \ head. \ \textcolor{red}{p \hookrightarrow_\square head} * head\textsf{.key} = \textsf{MIN} $
  {{< /fragment >}}

  {{< fragment >}}
  $  \exists \ head. \ p \hookrightarrow_\square head * \textcolor{red}{head\textsf{.key} = \textsf{MIN}} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Iris Invariants

<div class="r-stack">
{{< fragment weight=1 class="current-visible" >}}
<span class="inv">
$ I $
</span><sup class="name">$ \ \mathcal{N} $</sup>
{{< /fragment >}}

{{< fragment weight=2 class="current-visible" >}}
<span class="inv" style="border-color: red">
$ I $
</span><sup class="name">$ \ \mathcal{N} $</sup>
{{< /fragment >}}

{{< fragment weight=3 class="current-visible" >}}
<span class="inv">
$ I $
</span><sup class="name">$ \ \textcolor{red}{\mathcal{N}} $</sup>
{{< /fragment >}}

{{< fragment weight=4 >}}
<span class="smath" style="border-bottom-style: solid; padding-bottom: 6px;">
<span class="fragment" data-fragment-index="7">
$\left\{ \ \textcolor{red}{\triangleright \ I} * P \ \right\} \ e \ \left\{ \ v. \ \textcolor{red}{\triangleright I} * Q(v) \ \right\}_{\textcolor{red}{\mathcal{E} \setminus \mathcal{N}}}$
</span>
$\quad$
<span class="fragment" data-fragment-index="5">
$ \textsf{atomic}(e) $
</span>
$\quad$
<span class="fragment" data-fragment-index="6">
$ \mathcal{N} \subseteq \mathcal{E} $
</span>
</span>

<br>
<span class="inv">
$ I $
</span><sup class="name">$ \ \mathcal{N} $</sup>
<span class="smath">
$ \vdash \left\{ \ P \ \right\} \ e \ \left\{ \ v. \ Q(v) \ \right\}_{\mathcal{E}} $
</span>
{{< /fragment >}}

</div>

---

### Bottom List

<div class="r-stack">
  {{< fragment class="current-visible" >}}
  <span class="inv">
  $\textsf{BotListInv}(head, \gamma^0) $
  </span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  <span class="inv">
  $\textsf{BotListInv}(head, \gamma^0) $
  </span><sup class="name">$ \ \textcolor{red}{\textsf{levelN}(0)} $</sup>
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  <span class="inv">
  $\textsf{BotListInv}(\textcolor{red}{head}, \gamma^0) $
  </span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  <span class="inv">
  $\textsf{BotListInv}(head, \textcolor{red}{\gamma^0}) $
  </span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Sublists

<div class="r-stack">
  {{< fragment class="current-visible" >}}
  <span class="inv">
  $ \textsf{SublistInv}(lvl, head, \gamma^{lvl}, \gamma^{lvl-1}) $
  </span><sup class="name">$ \ \textsf{levelN}(lvl) $</sup>
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  <span class="inv">
  $ \textsf{SublistInv}(\textcolor{red}{lvl}, head, \gamma^{lvl}, \gamma^{lvl-1}) $
  </span><sup class="name">$ \ \textcolor{red}{\textsf{levelN}(lvl)} $</sup>
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  <span class="inv">
  $ \textsf{SublistInv}(lvl, head, \textcolor{red}{\gamma^{lvl}}, \textcolor{red}{\gamma^{lvl-1}}) $
  </span><sup class="name">$ \ \textsf{levelN}(lvl) $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Partial View

{{< fragment weight=1 >}}
<span class="smath">$ \textsf{IsSkipList}(p, M, q, \gamma) \triangleq $</span>
{{< /fragment >}}
{{< fragment weight=2 >}}
<span class="smath">$ \exists \ head. \ p \hookrightarrow_\square head * head\textsf{.key} = \textsf{MIN} $</span>
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="smath">$*$</span>
{{< /fragment >}}

{{< fragment weight=5 >}}
<span class="ghost"> 
$ \circ_q \ M $
</span><sup class="name">$ \ \gamma^0_F $</sup>
{{< /fragment >}}
{{< fragment weight=5 >}}
<span class="smath">$*$</span>
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="inv">
$\textsf{BotListInv}(head, \gamma^0) $
</span><sup class="name">$ \ \textsf{levelN}(0) $</sup>
{{< /fragment >}}
{{< fragment weight=4 >}}
<span class="smath">$*$</span>
{{< /fragment >}}

{{< fragment weight=4 >}}
<span class="smath">
$ \mathop{\Huge\ast}\limits_{lvl = 1}^{\textsf{HMAX}} $
</span>
<span class="inv">
$ \textsf{SublistInv}(lvl, head, \gamma^{lvl}, \gamma^{lvl-1}) $
</span><sup class="name">$ \ \textsf{levelN}(lvl) $</sup>
{{< /fragment >}}

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## Bottom List Invariant

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Authoritative Ghost State

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  <span class="ghost"> 
  $ \bullet \ a $
  </span><sup class="name">$ \ \gamma $</sup>
  $*$
  <span class="ghost"> 
  $ \circ \ f $
  </span><sup class="name">$ \ \gamma $</sup>
  $ \phantom{\vdash f \preccurlyeq a} $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  <span class="ghost"> 
  $ \bullet \ a $
  </span><sup class="name">$ \ \gamma $</sup>
  $*$
  <span class="ghost"> 
  $ \circ \ f $
  </span><sup class="name">$ \ \gamma $</sup>
  $ \vdash f \preccurlyeq a $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $ \circ \ f_1 \cdot \circ \ f_2 = \circ \ (f_1 \cdot f_2)$
  {{< /fragment >}}

  {{< fragment >}}
  $ \circ_{q_1} \ f_1 \cdot \circ_{q_2} \ f_2 = \circ_{q_1 + q_2} \ (f_1 \cdot f_2)$
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Map Fragments

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Fractions

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Set Membership

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  <span class="ghost"> 
  $ \bullet \ S $
  </span><sup class="name">$ \ \gamma $</sup>
  $*$
  <span class="ghost"> 
  $ \circ \ \{ \ node \ \} $
  </span><sup class="name">$ \ \gamma $</sup>
  $ \phantom{\vdash node \in S} $
  {{< /fragment >}}

  {{< fragment >}}
  <span class="ghost"> 
  $ \bullet \ S $
  </span><sup class="name">$ \ \gamma $</sup>
  $*$
  <span class="ghost"> 
  $ \circ \ \{ \ node \ \} $
  </span><sup class="name">$ \ \gamma $</sup>
  $ \vdash node \in S $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Key-Value Pairs

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $ \exists \ v. \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} v $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $ \exists \ vs. \ M[node\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts}) $
  {{< /fragment >}}

  {{< fragment >}}
  $ v\textsf{.val} \in vs $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Sortedness

<div class="r-stack smath">
  {{< fragment >}}
  $ \textsf{L} \triangleq [head] +\kern-1.3ex+\kern0.8ex L +\kern-1.3ex+\kern0.8ex [\textsf{tail}] $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Successor Chain

<div class="smath">
{{< fragment >}}
$ \textsf{IsNext}(lvl, pred, succ) \triangleq $
{{< /fragment >}}

{{< fragment >}}
$ \exists \ s. \ pred\textsf{.next}[lvl] \hookrightarrow_{\frac{1}{2}} s $
{{< /fragment >}}

{{< fragment >}}
$ * \ s \hookrightarrow_\square succ $
{{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Lock Resources

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $ \textsf{HasLock}(lvl, node, R) \triangleq \exists \ \gamma, l. \begin{array}{c} node\textsf{.lock}[lvl] \hookrightarrow_\square l \ * \\\\ \textsf{IsLock}(\gamma, l, R(node, lvl)) \end{array} $
  {{< /fragment >}}

  {{< fragment >}}
  $ \textsf{InBotLock}(n, 0) \triangleq \exists \ s, succ. \begin{array}{c} n\textsf{.next}[0] \hookrightarrow_{\frac{1}{2}} s * s \hookrightarrow_\square succ \ * \\\\ (succ = \textsf{tail} \lor \exists \ v. \ succ\textsf{.val} \hookrightarrow_{\frac{1}{2}} v) \end{array} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Invariant Definition

<div class="smath">
{{< fragment weight=1 >}}
$ \textsf{BotListInv}(head, \gamma) \triangleq \exists \ M, S, L. $
{{< /fragment >}}
{{< fragment weight=2 >}}
<span class="ghost"> 
$ \bullet \ M $
</span><sup class="name">$ \ \gamma_F^{\phantom{0}} $</sup>
{{< /fragment >}}
{{< fragment weight=3 >}}
$ * \ M\textsf{.keys} = S\textsf{.keys} $
$*$
{{< /fragment >}}

$ $
{{< fragment weight=7 >}}
<span class="ghost"> 
$ \textsf{KeyRange} \setminus S\textsf{.keys} $
</span><sup class="name">$ \ \gamma_T^{\phantom{0}} $</sup>
$*$
{{< /fragment >}}
{{< fragment weight=3 >}}
<span class="ghost"> 
$ \bullet \ S $
</span><sup class="name">$ \ \gamma_A^{\phantom{0}} $</sup>
{{< /fragment >}}
{{< fragment weight=4 >}}
$*$
{{< /fragment >}}
{{< fragment weight=5 >}}
$ S \equiv_P L $
$ * \ \textsf{Sorted}(\textsf{L}) $
$ * $
{{< /fragment >}}

{{< fragment weight=6 >}}
$
\mathop{\Huge\ast}\limits_{i = 0}^{|L|}
\left( 
  \begin{array}{c}
    \textsf{IsNext}(0, \textsf{L}[i], \textsf{L}[i+1]) \ * \\\\
    \textsf{HasLock}(0, \textsf{L}[i],  \textsf{InBotLock})
  \end{array}
\right)
$
$ * $
{{< /fragment >}}
{{< fragment weight=4 >}}
$
\mathop{\Huge\ast}\limits_{n \in S}
\left( 
  \exists \ v, vs.
  \begin{array}{c}
    n\textsf{.val} \hookrightarrow_{\frac{1}{2}} v * v\textsf{.val} \in vs \ * \\\\
    M[n\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts})
  \end{array}
\right)
$
{{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## Sublist Invariant

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Sublist Relation

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Ghost Tokens

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Height Distribution

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $ \textsf{put} \ p \ k \ v \ t $
  {{< /fragment >}}

  {{< fragment >}}
  <span class="ghost"> 
  $ \{ k \} $
  </span><sup class="name">$ \ \gamma_T^h $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Lock Resources

<div class="smath">
  {{< fragment >}}
  $ \textsf{InSubLock}(n, lvl) \triangleq \exists \ s. \ n\textsf{.next}[lvl] \hookrightarrow_{\frac{1}{2}} s $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Invariant Definition

<div class="smath">
{{< fragment weight=1 >}}
$ \textsf{SublistInv}(lvl, head, \Gamma, \gamma) \triangleq \exists \ S, L. $
{{< /fragment >}}

{{< fragment weight=4 >}}
<span class="ghost"> 
$ \textsf{KeyRange} \setminus S\textsf{.keys} $
</span><sup class="name">$ \ \Gamma_T^{\phantom{0}} $</sup>
$*$
{{< /fragment >}}
{{< fragment weight=2 >}}
<span class="ghost"> 
$ \bullet \ S $
</span><sup class="name">$ \ \Gamma_A^{\phantom{0}} $</sup>
$ * \ S \equiv_P L $
$ * \ \textsf{Sorted}(\textsf{L}) $
{{< /fragment >}}
{{< fragment weight=3 >}}
$ * $
{{< /fragment >}}

{{< fragment weight=3 >}}
$
\mathop{\Huge\ast}\limits_{i = 0}^{|L|}
\left( 
  \begin{array}{c}
    \textsf{IsNext}(lvl, \textsf{L}[i], \textsf{L}[i+1]) \ * \\\\
    \textsf{HasLock}(lvl, \textsf{L}[i],  \textsf{InSubLock})
  \end{array}
\right)
$
{{< /fragment >}}
{{< fragment weight=5 >}}
$ * $
$
\mathop{\Huge\ast}\limits_{n \in S}
\left(
  \vphantom{\begin{array}{c}
    n\textsf{.val} \hookrightarrow_{\frac{1}{2}} v * v\textsf{.val} \in vs \ * \\\\
    M[n\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts})
  \end{array}}
\right.
$
<span class="ghost"> 
$ \circ \ \\{ n \\} $
</span><sup class="name">$ \ \gamma_A^{\phantom{0}} $</sup>
$*$
<span class="ghost"> 
$ \\{ n\textsf{.key} \\} $
</span><sup class="name">$ \ \gamma_T^{\phantom{0}} $</sup>
$
\left.
  \vphantom{\begin{array}{c}
    n\textsf{.val} \hookrightarrow_{\frac{1}{2}} v * v\textsf{.val} \in vs \ * \\\\
    M[n\textsf{.key}] = \textsf{Some}(vs, v\textsf{.ts})
  \end{array}}
\right)
$
{{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## Value Updates

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Update procedure

<div class="smath">
  {{< fragment >}}
  $ \ \textsf{update} \ node \ v \ t \ $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Vertical List

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} val $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $ \textbf{\textsf{if}} \ t < val\textsf{.ts} \ \textbf{\textsf{then}} \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} val $
  {{< /fragment >}}

  {{< fragment >}}
  $ \textbf{\textsf{else}} \ \exists \ p. \ node\textsf{.val} \hookrightarrow_{\frac{1}{2}} (v, t, p) * p \hookrightarrow_\square val $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Local Fragment

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  <span class="ghost"> 
  $ \circ_q \ M $
  </span><sup class="name">$ \ \gamma_F^{\phantom{0}} $</sup>
  $ \ \phantom{\cup \{ \ k : (\{ v \}, t) \ \}} $
  {{< /fragment >}}

  {{< fragment >}}
  <span class="ghost"> 
  $ \circ_q \ M \cup \{ \ k : (\{ v \}, t) \ \} $
  </span><sup class="name">$ \ \gamma_F^{\phantom{0}} $</sup>
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## A Simple Client

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Code Overview

<div class="smath">
  {{< fragment weight=1 >}}
  $ \textbf{\textsf{let}} \ p = \textsf{new} \ \textbf{\textsf{in}} $
  {{< /fragment >}}
</div>

{{< fragment weight=2 >}}
<div class="smath" style="display: inline-block; border-right-style: solid; padding-right: 10px">
<div class="r-stack">
{{< fragment weight=2 class="current-visible" >}}
$ 
\textsf{put} \ p \ 10 \ 1 \ 0; \\\\
\textsf{put} \ p \ 20 \ 2 \ 1; \\\\
\textsf{put} \ p \ 10 \ 3 \ 2;
$
{{< /fragment >}}

{{< fragment weight=3 class="current-visible" >}}
$
\textsf{put} \ p \ 10 \ 1 \ 0; \\\\
\textcolor{red}{\textsf{put} \ p \ 20 \ 2 \ 1;} \\\\
\textsf{put} \ p \ 10 \ 3 \ 2;
$
{{< /fragment >}}

{{< fragment weight=4 class="current-visible" >}}
$
\textsf{put} \ p \ 10 \ 1 \ 0; \\\\
\textsf{put} \ p \ 20 \ 2 \ 1; \\\\
\textcolor{red}{\textsf{put} \ p \ 10 \ 3 \ 2;}
$
{{< /fragment >}}

{{< fragment weight=5 class="current-visible" >}}
$
\textcolor{red}{\textsf{put} \ p \ 10 \ 1 \ 0;} \\\\
\textsf{put} \ p \ 20 \ 2 \ 1; \\\\
\textsf{put} \ p \ 10 \ 3 \ 2;
$
{{< /fragment >}}

{{< fragment weight=6 >}}
$
\textsf{put} \ p \ 10 \ 1 \ 0; \\\\
\textsf{put} \ p \ 20 \ 2 \ 1; \\\\
\textsf{put} \ p \ 10 \ 3 \ 2;
$
{{< /fragment >}}
</div>
</div>
{{< /fragment >}}

{{< fragment weight=2 >}}
<div class="smath" style="display: inline-block; border-left-style: solid; padding-left: 10px">
<div class="r-stack">
{{< fragment weight=2 class="current-visible" >}}
$ 
\textsf{put} \ p \ 20 \ 5 \ 0; \\\\
\textsf{put} \ p \ 10 \ 2 \ 1; \\\\
\textsf{put} \ p \ 10 \ 6 \ 2;
$
{{< /fragment >}}

{{< fragment weight=3 class="current-visible" >}}
$
\textcolor{red}{\textsf{put} \ p \ 20 \ 5 \ 0;} \\\\
\textsf{put} \ p \ 10 \ 2 \ 1; \\\\
\textsf{put} \ p \ 10 \ 6 \ 2;
$
{{< /fragment >}}

{{< fragment weight=4 class="current-visible" >}}
$
\textsf{put} \ p \ 20 \ 5 \ 0; \\\\
\textsf{put} \ p \ 10 \ 2 \ 1; \\\\
\textcolor{red}{\textsf{put} \ p \ 10 \ 6 \ 2;}
$
{{< /fragment >}}

{{< fragment weight=5 class="current-visible" >}}
$
\textsf{put} \ p \ 20 \ 5 \ 0; \\\\
\textcolor{red}{\textsf{put} \ p \ 10 \ 2 \ 1;} \\\\
\textsf{put} \ p \ 10 \ 6 \ 2;
$
{{< /fragment >}}

{{< fragment weight=6 >}}
$
\textsf{put} \ p \ 20 \ 5 \ 0; \\\\
\textsf{put} \ p \ 10 \ 2 \ 1; \\\\
\textsf{put} \ p \ 10 \ 6 \ 2;
$
{{< /fragment >}}
</div>
</div>
{{< /fragment >}}

<div class="smath">
  {{< fragment weight=6 >}}
  $$ (\textsf{get} \ p \ 10, \textsf{get} \ p \ 20) $$
  {{< /fragment >}}
</div>

<!-- <div class="smath">
  {{< fragment weight=1 >}}
  $ \textbf{\textsf{let}} \ p = \textsf{new} \ \textbf{\textsf{in}} $
  {{< /fragment >}}

  <div class="r-stack">
  {{< fragment weight=2 class="current-visible" >}}
  $
  \begin{array}{c||c}
    \textsf{put} \ p \ 10 \ 1 \ 0; & \textsf{put} \ p \ 20 \ 5 \ 0; \\\\
    \textsf{put} \ p \ 20 \ 2 \ 1; & \textsf{put} \ p \ 10 \ 2 \ 1; \\\\
    \textsf{put} \ p \ 10 \ 3 \ 2; & \textsf{put} \ p \ 10 \ 6 \ 2;
  \end{array}
  $
  {{< /fragment >}}

  {{< fragment weight=3 class="current-visible" >}}
  $
  \begin{array}{c||c}
    \textsf{put} \ p \ 10 \ 1 \ 0; & \textcolor{red}{\textsf{put} \ p \ 20 \ 5 \ 0;} \\\\
    \textcolor{red}{\textsf{put} \ p \ 20 \ 2 \ 1;} & \textsf{put} \ p \ 10 \ 2 \ 1; \\\\
    \textsf{put} \ p \ 10 \ 3 \ 2; & \textsf{put} \ p \ 10 \ 6 \ 2;
  \end{array}
  $
  {{< /fragment >}}

  {{< fragment weight=4 class="current-visible" >}}
  $
  \begin{array}{c||c}
    \textsf{put} \ p \ 10 \ 1 \ 0; & \textsf{put} \ p \ 20 \ 5 \ 0; \\\\
    \textsf{put} \ p \ 20 \ 2 \ 1; & \textsf{put} \ p \ 10 \ 2 \ 1; \\\\
    \textcolor{red}{\textsf{put} \ p \ 10 \ 3 \ 2;} & \textcolor{red}{\textsf{put} \ p \ 10 \ 6 \ 2;}
  \end{array}
  $
  {{< /fragment >}}

  {{< fragment weight=5 class="current-visible" >}}
  $
  \begin{array}{c||c}
    \textcolor{red}{\textsf{put} \ p \ 10 \ 1 \ 0;} & \textsf{put} \ p \ 20 \ 5 \ 0; \\\\
    \textsf{put} \ p \ 20 \ 2 \ 1; & \textcolor{red}{\textsf{put} \ p \ 10 \ 2 \ 1;} \\\\
    \textsf{put} \ p \ 10 \ 3 \ 2; & \textsf{put} \ p \ 10 \ 6 \ 2;
  \end{array}
  $
  {{< /fragment >}}

  {{< fragment weight=6 >}}
  $
  \begin{array}{c||c}
    \textsf{put} \ p \ 10 \ 1 \ 0; & \textsf{put} \ p \ 20 \ 5 \ 0; \\\\
    \textsf{put} \ p \ 20 \ 2 \ 1; & \textsf{put} \ p \ 10 \ 2 \ 1; \\\\
    \textsf{put} \ p \ 10 \ 3 \ 2; & \textsf{put} \ p \ 10 \ 6 \ 2;
  \end{array}
  $
  {{< /fragment >}}
  </div>

  {{< fragment weight=6 >}}
  $ (\textsf{get} \ p \ 10, \textsf{get} \ p \ 20)  $
  {{< /fragment >}}
</div> -->

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Initialization

<div class="smath">
  {{< fragment >}}
  $ \textcolor{purple}{\\{ \ \textsf{True} \ \\}} $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment >}}
  $ \textbf{\textsf{let}} \ p = \textsf{new} \ \textbf{\textsf{in}} $
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $ \textcolor{purple}{\\{ \ \exists \ \gamma. \ \textsf{IsSkipList}(p, \varnothing, 1, \gamma) \ \\}} $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $ \textcolor{purple}{\\{ \ \textsf{IsSkipList}(p, \varnothing, 1, \gamma) \ \\}} $
  {{< /fragment >}}

  {{< fragment >}}
  $ \textcolor{purple}{\\{ \ \textsf{IsSkipList}(p, \varnothing \cdot \varnothing, \frac{1}{2} + \frac{1}{2}, \gamma) \ \\}} $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment >}}
  $ \downarrow $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment >}}
  $ \textcolor{purple}{\\{ \ \textcolor{blue}{\textsf{IsSkipList}(p, \varnothing, \frac{1}{2}, \gamma)} * \textcolor{red}{\textsf{IsSkipList}(p, \varnothing, \frac{1}{2}, \gamma)} \ \\}} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Updates

<div class="smath" style="display: inline-block; border-right-style: solid; padding-right: 10px">
  {{< fragment weight=1 >}}
  $ \textcolor{blue}{\\{ \ \textsf{IsSkipList}(p, \varnothing, \frac{1}{2}, \gamma) \ \\}} $
  {{< /fragment >}}

  $ \textsf{put} \ p \ 10 \ 1 \ 0; $

  <div class="r-stack">
  {{< fragment weight=2 class="current-visible" >}}
  $ \textcolor{blue}{\\{ \ \textsf{IsSkipList}(p, \varnothing \cup \\{ \ 10 : (\\{ 1 \\}, 0) \ \\}, \frac{1}{2}, \gamma) \ \\}} $
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  $ \textcolor{blue}{\\{ \ \textsf{IsSkipList}(p, \\{ \ 10 : (\\{ 1 \\}, 0) \ \\}, \frac{1}{2}, \gamma) \ \\}} $
  {{< /fragment >}}
  </div>

  $ \textsf{put} \ p \ 20 \ 2 \ 1; $

  {{< fragment weight=4 >}}
  $ \textcolor{blue}{\left\\{ \textsf{IsSkipList}\left(p, \begin{array}{l} \\{ \ 10 : (\\{ 1 \\}, 0) \ \\} \ \cup \\\\ \\{ \ 20 : (\\{ 2 \\}, 1) \\} \end{array}, \frac{1}{2}, \gamma\right) \right\\}} $
  {{< /fragment >}}

  $ \textsf{put} \ p \ 10 \ 3 \ 2; $

  {{< fragment weight=5 >}}
  $ \textcolor{blue}{\left\\{ \textsf{IsSkipList}\left(p, \begin{array}{l} \\{ \ 10 : (\\{ 1 \\}, 0) \ \\} \ \cup \\\\ \\{ \ 20 : (\\{ 2 \\}, 1) \ \\} \ \cup \\\\ \\{ \ 10 : (\\{ 3 \\}, 2) \ \\} \end{array}, \frac{1}{2}, \gamma\right) \right\\}} $
  {{< /fragment >}}
</div>

<div class="smath" style="display: inline-block; border-left-style: solid; padding-left: 10px">
  {{< fragment weight=1 >}}
  $ \textcolor{red}{\\{ \ \textsf{IsSkipList}(p, \varnothing, \frac{1}{2}, \gamma) \ \\}} $
  {{< /fragment >}}

  $ \textsf{put} \ p \ 20 \ 5 \ 0; $

  <div class="r-stack">
  {{< fragment weight=2 class="current-visible" >}}
  $ \textcolor{red}{\\{ \ \textsf{IsSkipList}(p, \varnothing \cup \\{ \ 20 : (\\{ 5 \\}, 0) \ \\}, \frac{1}{2}, \gamma) \ \\}} $
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  $ \textcolor{red}{\\{ \ \textsf{IsSkipList}(p, \\{ \ 20 : (\\{ 5 \\}, 0) \ \\}, \frac{1}{2}, \gamma) \ \\}} $
  {{< /fragment >}}
  </div>

  $ \textsf{put} \ p \ 10 \ 2 \ 1; $

  {{< fragment weight=4 >}}
  $ \textcolor{red}{\left\\{ \textsf{IsSkipList}\left(p, \begin{array}{l} \\{ \ 20 : (\\{ 5 \\}, 0) \ \\} \ \cup \\\\ \\{ \ 10 : (\\{ 2 \\}, 1) \ \\} \end{array}, \frac{1}{2}, \gamma\right) \right\\}} $
  {{< /fragment >}}

  $ \textsf{put} \ p \ 10 \ 6 \ 2; $

  {{< fragment weight=5 >}}
  $ \textcolor{red}{\left\\{ \textsf{IsSkipList}\left(p, \begin{array}{l} \\{ \ 20 : (\\{ 5 \\}, 0) \ \\} \ \cup \\\\ \\{ \ 10 : (\\{ 2 \\}, 1) \ \\} \ \cup \\\\ \\{ \ 10 : (\\{ 6 \\}, 2) \ \\} \end{array}, \frac{1}{2}, \gamma\right) \right\\}} $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Lookup

<div class="smath">
  {{< fragment >}}
  $
  \textcolor{purple}{\left\\{ \textcolor{blue}{\textsf{IsSkipList}\left(p, \begin{array}{l} \\{ \ 10 : (\\{ 1 \\}, 0) \ \\} \ \cup \\\\ \\{ \ 20 : (\\{ 2 \\}, 1) \ \\} \ \cup \\\\ \\{ \ 10 : (\\{ 3 \\}, 2) \ \\} \end{array}, \frac{1}{2}, \gamma\right)}
  *
  \textcolor{red}{\textsf{IsSkipList}\left(p, \begin{array}{l} \\{ \ 20 : (\\{ 5 \\}, 0) \ \\} \ \cup \\\\ \\{ \ 10 : (\\{ 2 \\}, 1) \ \\} \ \cup \\\\ \\{ \ 10 : (\\{ 6 \\}, 2) \ \\} \end{array}, \frac{1}{2}, \gamma\right)} \right\\}} \\\\
  \vphantom{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \\\\
  $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment >}}
  $ \downarrow $
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $
  \textcolor{purple}{\left\\{ \textsf{IsSkipList}\left(p, \left(\begin{array}{l} \textcolor{blue}{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \ \cup \\\\ \textcolor{blue}{\\{ \ 20 : (\\{ 2 \\}, 1) \ \\}} \ \cup \\\\ \textcolor{blue}{\\{ \ 10 : (\\{ 3 \\}, 2) \ \\}} \end{array}\right) \cup \left(\begin{array}{l} \textcolor{red}{\\{ \ 20 : (\\{ 5 \\}, 0) \ \\}} \ \cup \\\\ \textcolor{red}{\\{ \ 10 : (\\{ 2 \\}, 1) \ \\}} \ \cup \\\\ \textcolor{red}{\\{ \ 10 : (\\{ 6 \\}, 2) \ \\}} \end{array}\right), \textcolor{blue}{\frac{1}{2}} + \textcolor{red}{\frac{1}{2}}, \gamma\right) \right\\}}
  $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $
  \textcolor{purple}{\left\\{ \textsf{IsSkipList}\left(p, \left(\begin{array}{l} \textcolor{blue}{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \ \cup \\\\ \textcolor{blue}{\\{ \ 20 : (\\{ 2 \\}, 1) \ \\}} \ \cup \\\\ \textcolor{blue}{\\{ \ 10 : (\\{ 3 \\}, 2) \ \\}} \end{array}\right) \cup \left(\begin{array}{l} \textcolor{red}{\\{ \ 20 : (\\{ 5 \\}, 0) \ \\}} \ \cup \\\\ \textcolor{red}{\\{ \ 10 : (\\{ 2 \\}, 1) \ \\}} \ \cup \\\\ \textcolor{red}{\\{ \ 10 : (\\{ 6 \\}, 2) \ \\}} \end{array}\right), 1, \gamma\right) \right\\}}
  $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $
  \textcolor{purple}{\left\\{ \textsf{IsSkipList}\left(p, \left(\begin{array}{l} \textcolor{blue}{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \cup \textcolor{blue}{\\{ \ 10 : (\\{ 3 \\}, 2) \ \\}} \ \cup \\\\ \textcolor{red}{\\{ \ 10 : (\\{ 2 \\}, 1) \ \\}} \cup \textcolor{red}{\\{ \ 10 : (\\{ 6 \\}, 2) \ \\}} \end{array}\right) \cup \left(\begin{array}{l} \textcolor{blue}{\\{ \ 20 : (\\{ 2 \\}, 1) \ \\}} \ \cup \\\\ \textcolor{red}{\\{ \ 20 : (\\{ 5 \\}, 0) \ \\}} \end{array}\right), 1, \gamma\right) \right\\}}
  $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $
  \textcolor{purple}{\left\\{ \textsf{IsSkipList}\left(p, \left\\{ \ 10 : \begin{array}{l} \textcolor{blue}{(\\{ 1 \\}, 0)} \cdot \textcolor{blue}{(\\{ 3 \\}, 2)} \ \cdot \\\\ \textcolor{red}{(\\{ 2 \\}, 1)} \cdot \textcolor{red}{(\\{ 6 \\}, 2)} \end{array} \right\\} \cup \left\\{ \ 20 : \begin{array}{l} \textcolor{blue}{(\\{ 2 \\}, 1)} \ \cdot \\\\ \textcolor{red}{(\\{ 5 \\}, 0)} \end{array} \right\\}, 1, \gamma\right) \right\\}}
  $
  {{< /fragment >}}

  {{< fragment >}}
  $
  \textcolor{purple}{ \left\\{ \ \textsf{IsSkipList}\left(p, \left\\{ \ 10 : (\\{ \textcolor{blue}{3}, \textcolor{red}{6} \\}, 2) \right\\} \cup \left\\{ \ 20 : (\\{ \textcolor{blue}{2} \\}, 1)\right\\}, 1, \gamma\right) \ \right\\}}
  $
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment >}}
  $ (\textsf{get} \ p \ 10, \textsf{get} \ p \ 20) $
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment class="current-visible" >}}
  $
  \vphantom{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \\\\
  \textcolor{purple}{ \left\\{
    (v_1^?, v_2^?).
    \phantom{\begin{array}{c}
      \textsf{IsSkipList}\left(p, \left\\{ \ 10 : (\\{ \textcolor{blue}{3}, \textcolor{red}{6} \\}, 2) \right\\} \cup \left\\{ \ 20 : (\\{ \textcolor{blue}{2} \\}, 1)\right\\}, 1, \gamma\right) \ * \\\\
      \exists \ v_1, v_2. \ v_1^? = \textsf{Some}(v_1, 2) * v_1 \in \\{ \textcolor{blue}{3}, \textcolor{red}{6} \\} * v_2^? = \textsf{Some}(v_2, 1) * v_2 \in \\{ \textcolor{blue}{2} \\}
    \end{array}}
  \right\\}}
  $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $
  \vphantom{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \\\\
  \textcolor{purple}{ \left\\{
    (v_1^?, v_2^?).
    \begin{array}{c}
      \textsf{IsSkipList}\left(p, \left\\{ \ 10 : (\\{ \textcolor{blue}{3}, \textcolor{red}{6} \\}, 2) \right\\} \cup \left\\{ \ 20 : (\\{ \textcolor{blue}{2} \\}, 1)\right\\}, 1, \gamma\right) \phantom{\ *} \\\\
      \phantom{\exists \ v_1, v_2. \ v_1^? = \textsf{Some}(v_1, 2) * v_1 \in \\{ \textcolor{blue}{3}, \textcolor{red}{6} \\} * v_2^? = \textsf{Some}(v_2, 1) * v_2 \in \\{ \textcolor{blue}{2} \\}}
    \end{array}
  \right\\}}
  $
  {{< /fragment >}}

  {{< fragment class="current-visible" >}}
  $
  \vphantom{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \\\\
  \textcolor{purple}{ \left\\{
    (v_1^?, v_2^?).
    \begin{array}{c}
      \textsf{IsSkipList}\left(p, \left\\{ \ 10 : (\\{ \textcolor{blue}{3}, \textcolor{red}{6} \\}, 2) \right\\} \cup \left\\{ \ 20 : (\\{ \textcolor{blue}{2} \\}, 1)\right\\}, 1, \gamma\right) \ * \\\\
      \exists \ v_1, v_2. \ v_1^? = \textsf{Some}(v_1, 2) * \phantom{v_1 \in \\{ \textcolor{blue}{3}, \textcolor{red}{6} \\} * } v_2^? = \textsf{Some}(v_2, 1) \phantom{* v_2 \in \\{ \textcolor{blue}{2} \\}}
    \end{array}
  \right\\}}
  $
  {{< /fragment >}}

  {{< fragment >}}
  $
  \vphantom{\\{ \ 10 : (\\{ 1 \\}, 0) \ \\}} \\\\
  \textcolor{purple}{ \left\\{
    (v_1^?, v_2^?).
    \begin{array}{c}
      \textsf{IsSkipList}\left(p, \left\\{ \ 10 : (\\{ \textcolor{blue}{3}, \textcolor{red}{6} \\}, 2) \right\\} \cup \left\\{ \ 20 : (\\{ \textcolor{blue}{2} \\}, 1)\right\\}, 1, \gamma\right) \ * \\\\
      \exists \ v_1, v_2. \ v_1^? = \textsf{Some}(v_1, 2) * v_1 \in \\{ \textcolor{blue}{3}, \textcolor{red}{6} \\} * v_2^? = \textsf{Some}(v_2, 1) * v_2 \in \\{ \textcolor{blue}{2} \\}
    \end{array}
  \right\\}}
  $
  {{< /fragment >}}
</div>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Timestamp Assumptions

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## Related Work

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Polaris

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Logical Atomicity

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Key-Value Specifications

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

<section>

## Conclusion

<sup> (continue below) </sup>

{{< speaker_note >}}

{{< /speaker_note >}}

---

### Future Work

{{< speaker_note >}}

{{< /speaker_note >}}

</section>

---

# Thank you!

{{< speaker_note >}}

{{< /speaker_note >}}