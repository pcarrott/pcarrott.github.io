---
title: 'Slides - Formal Verification of a Concurrent Map in Iris'
authors: []
tags: []
categories: []
date: '2022-02-05'
slides:
  theme: light
  highlight_style: dracula
---

### **Formal Verification of a<br>Concurrent Map in Iris**
#### Resourceful Reasoning beyond Linearization Points<br>for the Lazy JellyFish Skip List

<br>

<small>**Pedro Carrott** --- *INESC-ID and IST, University of Lisbon*</small>
<small>João Ferreira --- *INESC-ID and IST, University of Lisbon*</small>

<span class="footer"> Press the `S` key to view the speaker notes </span>

{{< speaker_note >}} <small>

The work I'll be presenting is based on my Master's thesis, advised by João Ferreira, which has been submitted for publication and is currently under review. It consists on the formal verification of the Lazy JellyFish Skip List, an implementation for concurrent maps with version control.

</small> {{< /speaker_note >}}

---

<section>

## Introduction

<small> (continue below) </small>

---

### Concurrent Maps and Skip Lists

{{< fragment >}}
<small>Concurrent maps are used by data store applications to index data efficiently.</small>
{{< /fragment >}}

{{< fragment >}}
<small>Most data stores record the value history of each key, rather than delete old values.</small>
{{< /fragment >}}

{{< fragment >}}
<small>The skip list is the most widely used map implementation by these applications.</small>
{{< /fragment >}}

{{< fragment >}}
<small>JellyFish extends traditional skip lists with a list of timestamped values per key.</small>
{{< /fragment >}}

{{< speaker_note >}} <small>

Maps provide an abstraction for a collection of key-value pairs. This is a useful abstraction for applications such as data stores, which require efficient structures to index data.

In fact, most of these applications maintain a history of values for each key in the map, so as to record different versions of the same data, instead of deleting outdated information.

The most widely used implementation for such concurrent append-only maps is the skip list data structure.

A state-of-the-art implementation for concurrent append-only skip lists is JellyFish, which extends traditional skip lists by storing a linked list in each node to reflect the history of values associated with its key.

</small> {{< /speaker_note >}}

---

### Iris and Logical Atomicity

{{< fragment >}}
<small>We verify a variant of JellyFish using the concurrent separation logic [Iris](https://iris-project.org/).</small>
{{< /fragment >}}

{{< fragment >}}
<small>Our proofs show operations on JellyFish to be logically atomic.</small>
{{< /fragment >}}

{{< fragment >}}
<small>We extend atomic triples to reason about resources *after* a linearization point.</small>
{{< /fragment >}}

{{< fragment >}}
<small>From the logically atomic specification, we build a suitable client specification.</small>
{{< /fragment >}}

{{< fragment >}}
<small>The Coq formalization is [publicly available](https://github.com/sr-lab/iris-jellyfish).</small>
{{< /fragment >}}

{{< speaker_note >}} <small>

In this work, we verify the functional correctness of a lock-based variant of JellyFish using Iris, a state-of-the-art concurrent separation logic.

As a standard correctness criterion for concurrent operations, we prove operations on JellyFish to be logically atomic.

For this purpose, we extend the Iris definition of atomic triples to be able to reason about shared resources after the operation's linearization point.

We then show how to build from the logically atomic specification other specifications more suitable for client reasoning.

All our results are mechanized in Coq and available on GitHub.

</small> {{< /speaker_note >}}

</section>

---

<section>

## Skip Lists

<small> (continue below) </small>

{{< speaker_note >}} <small>

We begin by looking at the implementation of the lazy JellyFish skip list.

</small> {{< /speaker_note >}}

---

### Overview

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>A skip list contains two sentinel nodes with keys $\textsf{MIN}$ and $\textsf{MAX}$, linked in $\textsf{HMAX}$ lists.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>Each list is a sublist of its lower level and all lists are sorted by key.</small>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <small>Elements can be skipped by searching the lists in the higher levels.</small>
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

{{< speaker_note >}} <small>

The skip list is initialized with two sentinel nodes with keys MIN and MAX, defining the valid key range for the structure. The left sentinel contains an array of HMAX entries, each pointing to the right sentinel, initializing HMAX empty linked lists.

As new keys are inserted to the skip list, each list must always remain a sublist of the list directly below it, while the bottom list should contain all keys which have been inserted.

Since each level contains progressively fewer elements of the bottom list, maintaining all lists sorted allows searches in higher levels to skip elements that would otherwise be traversed in a standard linear search. We search in the top level ...

... stop searching when we reach a value equal to or greater than the key ...

... descend to the next level starting from the same element and repeat until we reach the bottom level.

If the key is not found upon reaching the bottom level, then we can conclude that it does not belong to the skip list.

</small> {{< /speaker_note >}}

---

### JellyFish

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>The JellyFish skip list implements a map, storing key-value pairs.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>Each node contains a <i>vertical list</i>, a timeline with timestamped values.</small>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <small>To append a new value, the timestamp must be <i>at least as recent</i> as the head's.</small>
  {{< /fragment >}}
</div>

{{< fragment weight=1 >}}
<img src="images/jelly5.svg">
{{< /fragment >}}

{{< speaker_note >}} <small>

Skip lists can also be used to implement key-value stores.

The JellyFish design keeps in each node a list of timestamped values, referred to as a vertical list, representing the timeline of values associated with the key.

The timeline retains its consistency by never appending new values to a vertical list if the new timestamp is less recent than the timestamp found at the head.

</small> {{< /speaker_note >}}

---

### Concurrent Updates

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>Updating threads employ lazy synchronization through locks.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>Traversal is done until the bottom, locking the key's predecessor.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>The key does not exist: a new node is linked to a random number of levels.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>The lock is released after insertion, locking the predecessor in the next level.</small>
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <small>Insertions are done bottom-up to maintain the sublist relation.</small>
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <small>Updates follow the same initial steps, locking the key's predecessor in the bottom level.</small>
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  <small>A node already exists for the key: the new value will be appended to the vertical list.</small>
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

{{< speaker_note >}} <small>

To ensure that concurrent updates to the data structure alter the state safely, the put operation employs a lazy synchronization strategy using locks. A thread trying to insert key 24 will first traverse the skip list until the bottom level to find its predecessor in key 17 and then ... 

... acquires the node's lock in the bottom level. Since the key has not been found, ...

... a new node is created with some random height. As the predecessor's lock has been acquired, ...

... we can replace its successor by linking the new node to the bottom level. The lock can then be released and the node can be inserted in the upper level.

Insertions are performed bottom-up so as to ensure that the sublist relation is preserved.

A following update on key 24 will repeat the same initial steps by traversing the skip list until the bottom level and locking its predecessor.

As the node already exists it will append a new value to its vertical list, as long as the timestamp is as recent as 3.

</small> {{< /speaker_note >}}

</section>

---

<section>

## Logical Atomicity

<small> (continue below) </small>

{{< speaker_note >}} <small>

To reason about the correctness of JellyFish, I'll now discuss the notion of logical atomicity.

</small> {{< /speaker_note >}}

---

### Linearization Point

{{< fragment >}}
<small>A non-atomic operation is logically atomic if a single atomic step yields its effects.</small>
{{< /fragment >}}

{{< fragment >}}
<small>Therefore, we can reason about the operation *as if* it were atomic.</small>
{{< /fragment >}}

{{< fragment >}}
<small>We refer to that step as the *linearization point* (LP) of the operation.</small>
{{< /fragment >}}

{{< fragment >}}
<small>The LP of an insertion in JellyFish is the LP of an insertion in the bottom level.</small>
{{< /fragment >}}

{{< speaker_note >}} <small>

An operation is said to be logically atomic if it contains a single atomic step which is responsible for the desired effects for the operation.

When reasoning about the possible interleavings between steps of concurrent executions, we can simply reason about the interleavings between the corresponding atomic step of each operation as if these operations were atomic.

This atomic step is commonly known as the operation's linearization point.

In the case of JellyFish, the linearization point of put corresponds to the linearization point of the bottom level insertion, meaning that insertions on the upper levels take place after the linearization point.

</small> {{< /speaker_note >}}

---

### Atomic Triples

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>Atomic triples describe the effects of an operation at its LP.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>The precondition describes the invariant shared state *before* the LP.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>The postcondition states how the shared state is affected *at* the LP.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>Atomic triples do not describe the invariant state *after* the LP.</small>
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  <small>Therefore, we cannot reason about upper level insertions in JellyFish.</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ \left\langle \ \alpha \ \right\rangle $
  $ \ e \ $
  $ \left\langle \ \beta \ \right\rangle $
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \left\langle \ \textcolor{red}{\alpha} \ \right\rangle $
  $ \ e \ $
  $ \left\langle \ \beta \ \right\rangle $
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $ \left\langle \ \alpha \ \right\rangle $
  $ \ e \ $
  $ \left\langle \ \textcolor{red}{\beta} \ \right\rangle $
  {{< /fragment >}}

  {{< fragment weight=4 >}}
  $ \left\langle \ \alpha \ \right\rangle $
  $ \ e \ $
  $ \left\langle \ \beta \ \right\rangle $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

The desired behaviour for a logically atomic operation can be expressed through atomic triples.

The precondition states an invariant assertion on the shared state which must hold throughout all steps prior to the linearization point.

The postcondition expresses how that shared state is altered at the linearization point.

After the linearization point, no assertion is provided losing all information regarding the shared state.

In other words, after inserting a node in the bottom level of JellyFish, we lose access to the entire data structure, so we cannot verify insertions in the remaining levels.

</small> {{< /speaker_note >}}

---

### Nested Data Structures

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>Nested data structures are data structures composed of other data structures.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>Generally, locks are acquired *before* and released *after* the LP.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>An atomic triple should describe the state of the shared object in its precondition.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>Therefore, we can access the shared object before the LP.</small>
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <small>We can thus acquire the lock contained within the shared object. </small>
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <small>At the LP, we can perform the atomic effects on the shared object.</small>
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  <small>After the LP, we do not know how to describe the invariant shared state, ...</small>
  {{< /fragment >}}

  {{< fragment weight=8 class=current-visible >}}
  <small>... so we can no longer access the shared object nor its lock.</small>
  {{< /fragment >}}

  {{< fragment weight=9 class=current-visible >}}
  <small>Without access to the lock, we are unable to release it.</small>
  {{< /fragment >}}

  {{< fragment weight=10 class=current-visible >}}
  <small>We can reason about the lock and the object as separately shared structures, ...</small>
  {{< /fragment >}}

  {{< fragment weight=11 >}}
  <small>... resulting in a more complex specification.</small>
  {{< /fragment >}}
</div>

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <img src="images/lock1.svg">
  {{< /fragment >}}

  {{< fragment weight=5 class=fade-out >}}
  {{< fragment weight=2 >}}
  <img src="images/lock2.svg">
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <img src="images/lock3.svg">
  {{< /fragment >}}

  {{< fragment weight=8 class=fade-out >}}
  {{< fragment weight=6 >}}
  <img src="images/lock4.svg">
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=10 class=fade-out >}}
  {{< fragment weight=8 >}}
  <img src="images/lock5.svg">
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=10 >}}
  <img src="images/lock6.svg">
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

In general, this problem arises with any data structure composed of other simpler data structures, such as any shared object containing a lock.

The standard use case for locks is to ensure mutual exclusion by acquiring the lock before reaching the linearization point, releasing it afterwards.

The atomic triple for such operations should assert ownership of the shared object in its precondition ...

... allowing the object to be accessed before the linearization point.

As the lock is a part of the object, we are thus able to acquire the lock ...

... before reaching the linearization point.

After the linearization point, however ...

... we lose access to the object ...

... and so we cannot release the lock.

An alternative approach would be to treat the object and the lock as separately shared resources ...

... but this would only result in a more complex and less intuitive specification.

</small> {{< /speaker_note >}}

---

### Beyond Linearization Points

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>To reason beyond LPs, we provide an alternative definition of atomic triples.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>In this definition, the invariant shared state must hold throughout *all* steps.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>These triples still describe the effects at the LP.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>We also include *private* pre and postconditions to describe *thread-local* resources.</small>
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  <small>The previous notation is still used when there are no local resources.</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ \left\langle \ \alpha \rightarrow \beta \ \right\rangle $
  $ \left\\{ \ P \ \right\\} $
  $ \ e \ $
  $ \left\\{ \ Q \ \right\\} $
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \left\langle \ \textcolor{red}{\alpha} \rightarrow \beta \ \right\rangle $
  $ \left\\{ \ P \ \right\\} $
  $ \ e \ $
  $ \left\\{ \ Q \ \right\\} $
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $ \left\langle \ \alpha \rightarrow \textcolor{red}{\beta} \ \right\rangle $
  $ \left\\{ \ P \ \right\\} $
  $ \ e \ $
  $ \left\\{ \ Q \ \right\\} $
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $ \left\langle \ \alpha \rightarrow \beta \ \right\rangle $
  $ \left\\{ \ \textcolor{red}{P} \ \right\\} $
  $ \ e \ $
  $ \left\\{ \ \textcolor{red}{Q} \ \right\\} $
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  $ \left\langle \ \alpha \ \right\rangle $
  $ \ e \ $
  $ \left\langle \ \beta \ \right\rangle $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

To solve this issue, we redefine the concept of logical atomicity.

The invariant assertion on the shared state must now hold throughout all steps of the operation ...

... while the effects are still described in the same manner.

Akin to standard Hoare triples, we also include private pre and postconditions to reason about thread-local resources.

Whenever atomic triples require no local resources, we still use the previous notation.

</small> {{< /speaker_note >}}

</section>

---

<section>

## A Map Specification

<small> (continue below) </small>

{{< speaker_note >}} <small>

I now present the atomic triples which express the intended behaviour for JellyFish.

</small> {{< /speaker_note >}}

---

### Representation Predicate

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>We first define a representation predicate for the map resources.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>The left sentinel pointer keeps track of the physical structure.</small>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <small>A map describes the abstract state of the structure.</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ \textsf{VCMap}(p, m, \Gamma) $
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \textsf{VCMap}(\textcolor{red}{p}, m, \Gamma) $
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  $ \textsf{VCMap}(p, \textcolor{red}{m}, \Gamma) $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

First, we require a representation predicate to describe the known state of the map, called VCMap.

VCMap is parameterized by the pointer to the left sentinel, which tracks the physical state, ...

... and a map which abstracts our interpretation of the state of the data structure.

</small> {{< /speaker_note >}}

---

### Triple for Constructor

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>A Hoare triple is defined for $\textsf{newMap}$, rather than an atomic triple.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>No resources are needed as a precondition ...</small>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <small>... and we obtain a pointer to an empty map.</small>
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=2 >}}
  $ \left\\{ \ \textsf{emp} \ \right\\} \\\\ $
  {{< /fragment >}}
</div>

<p class="smath">
  {{< fragment weight=1 >}}
  $ \textsf{newMap} \\\\ $
  {{< /fragment >}}
</p>

<p class="smath">
  {{< fragment weight=3 >}}
  $ \left\\{ \ \exists \ p, \ \Gamma. \ \textsf{VCMap}(p, \varnothing, \Gamma); \ p \ \right\\} $
  {{< /fragment >}}
</p>

{{< speaker_note >}} <small>

For the skip list constructor, we define a Hoare triple instead of an atomic triple, since it will never be called concurrently for the same object.

This method does not need any initial resources as a precondition ...

... and the postcondition simply asserts exclusive ownership of an empty map, where the return value p corresponds to the left sentinel pointer.

</small> {{< /speaker_note >}}

---

### Triple for Lookups

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>$\textsf{get}$ performs a search for a key.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>The invariant ties the shared resources to some abstract state $m$.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>The map remains unchanged after the search.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>The result is empty if the key is not in the map.</small>
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  <small>Otherwise, the most recent value is returned, ignoring the vertical list.</small>
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=2 >}}
  $ \left\langle \ m. \ \textsf{VCMap}(p, m, \Gamma) \ \right\rangle \\\\ $
  {{< /fragment >}}
</div>

<p class="smath">
  {{< fragment weight=1 >}}
  $ \textsf{get} \ p \ k \\\\ $
  {{< /fragment >}}
</p>

<p class="r-stack smath">
  {{< fragment weight=3 class=current-visible >}}
  $ \left\langle \ \textcolor{red}{\textsf{VCMap}(p, m, \Gamma)}; \begin{array}{c} \textsf{\textbf{match}} \ m[k] \ \textsf{\textbf{with}} \ \textsf{None} \Rightarrow \textsf{None} \ | \ \textsf{Some}(v, t, vl) \Rightarrow \textsf{Some}(v, t) \end{array} \right\rangle $
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $ \left\langle \ \textsf{VCMap}(p, m, \Gamma); \begin{array}{c} \textsf{\textbf{match}} \ \textcolor{red}{m[k]} \ \textsf{\textbf{with}} \ \textcolor{red}{\textsf{None}} \Rightarrow \textcolor{blue}{\textsf{None}} \ | \ \textsf{Some}(v, t, vl) \Rightarrow \textsf{Some}(v, t) \end{array} \right\rangle $
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  $ \left\langle \ \textsf{VCMap}(p, m, \Gamma); \begin{array}{c} \textsf{\textbf{match}} \ \textcolor{red}{m[k]} \ \textsf{\textbf{with}} \ \textsf{None} \Rightarrow \textsf{None} \ | \ \textcolor{red}{\textsf{Some}(v, t, vl)} \Rightarrow \textcolor{blue}{\textsf{Some}(v, t)} \end{array} \right\rangle $
  {{< /fragment >}}
</p>

{{< speaker_note >}} <small>

The get method performs a lookup for the current value of some key.

The invariant asserts shared ownership of a VCMap resource tied to some abstract state.

At the linearization point, this resource is preserved as is, since a search is not supposed to perform any changes.

If the key does not exist in the map, then the search must come up empty.

Otherwise, the value with the most recent timestamp should be returned, ignoring the vertical list.

</small> {{< /speaker_note >}}

---

### Triple for Updates

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>$\textsf{put}$ receives a key, value and timestamp.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>Again, the invariant ties the shared resources to some abstract state $m$.</small>
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  <small>At the LP, the map is updated depending on the values it stores.</small>
  {{< /fragment >}}
</div>

<div class="smath">
  {{< fragment weight=2 >}}
  $ \left\langle \ m. \ \textsf{VCMap}(p, m, \Gamma) \ \right\rangle \\\\ $
  {{< /fragment >}}
</div>

<p class="smath">
  {{< fragment weight=1 >}}
  $ \textsf{put} \ p \ k \ v \ t \\\\ $
  {{< /fragment >}}
</p>

<p class="smath">
  {{< fragment weight=3 >}}
  $ \left\langle \ \textsf{VCMap}(p, \textsf{CaseMap}(m, k, v, t), \Gamma) \ \right\rangle \\\\ $
  {{< /fragment >}}
</p>

{{< speaker_note >}} <small>

Finally, the put method is parameterized by the updated key, as well as its new value and timestamp.

We use the same invariant as the one for get.

Whether the abstract state of the map is updated will be determined by the state of the map at the linearization point.

</small> {{< /speaker_note >}}

---

### Map Updates

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>A case analysis is performed on the map's entry for the key.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>If the entry is empty, then the key is added to the map with the given value.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>Otherwise, an update to the entry will occur depending on the timestamp.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>If the given timestamp is *less recent*, then the map will remain unchanged.</small>
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  <small>Otherwise, the old value is appended to the vertical list, keeping the new value.</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ \begin{array}{rl} \textsf{CaseMap}(m, k, v, t) \triangleq & \textsf{\textbf{match}} \ m[k] \ \textsf{\textbf{with}} \\\\ & | \ \textsf{None} \Rightarrow \langle k : (v, t, []) \rangle m \\\\ & | \ \textsf{Some}(v_i, t_i, vl) \Rightarrow \textsf{\textbf{if}} \ t < t_i \ \textsf{\textbf{then}} \ m \ \textsf{\textbf{else}} \ \langle k : (v, t, (v_i, t_i) :: vl) \rangle m \end{array}$
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \begin{array}{rl} \textsf{CaseMap}(m, k, v, t) \triangleq & \textsf{\textbf{match}} \ \textcolor{red}{m[k]} \ \textsf{\textbf{with}} \\\\ & | \ \textcolor{red}{\textsf{None}} \Rightarrow \textcolor{blue}{\langle k : (v, t, []) \rangle m} \\\\ & | \ \textsf{Some}(v_i, t_i, vl) \Rightarrow \textsf{\textbf{if}} \ t < t_i \ \textsf{\textbf{then}} \ m \ \textsf{\textbf{else}} \ \langle k : (v, t, (v_i, t_i) :: vl) \rangle m \end{array}$
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $ \begin{array}{rl} \textsf{CaseMap}(m, k, v, t) \triangleq & \textsf{\textbf{match}} \ \textcolor{red}{m[k]} \ \textsf{\textbf{with}} \\\\ & | \ \textsf{None} \Rightarrow \langle k : (v, t, []) \rangle m \\\\ & | \ \textcolor{red}{\textsf{Some}(v_i, t_i, vl)} \Rightarrow \textsf{\textbf{if}} \ \textcolor{green}{t < t_i} \ \textsf{\textbf{then}} \ m \ \textsf{\textbf{else}} \ \langle k : (v, t, (v_i, t_i) :: vl) \rangle m \end{array}$
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $ \begin{array}{rl} \textsf{CaseMap}(m, k, v, t) \triangleq & \textsf{\textbf{match}} \ m[k] \ \textsf{\textbf{with}} \\\\ & | \ \textsf{None} \Rightarrow \langle k : (v, t, []) \rangle m \\\\ & | \ \textsf{Some}(v_i, t_i, vl) \Rightarrow \textsf{\textbf{if}} \ \textcolor{green}{t < t_i} \ \textsf{\textbf{then}} \ \textcolor{blue}{m} \ \textsf{\textbf{else}} \ \langle k : (v, t, (v_i, t_i) :: vl) \rangle m \end{array}$
  {{< /fragment >}}

  {{< fragment weight=5 >}}
  $ \begin{array}{rl} \textsf{CaseMap}(m, k, v, t) \triangleq & \textsf{\textbf{match}} \ m[k] \ \textsf{\textbf{with}} \\\\ & | \ \textsf{None} \Rightarrow \langle k : (v, t, []) \rangle m \\\\ & | \ \textsf{Some}(v_i, t_i, vl) \Rightarrow \textsf{\textbf{if}} \ \textcolor{green}{t < t_i} \ \textsf{\textbf{then}} \ m \ \textsf{\textbf{else}} \ \textcolor{blue}{\langle k : (v, t, (v_i, t_i) :: vl) \rangle m} \end{array}$
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

The new map abstraction will depend on the map's entry for the key.

If the key is not in the map, then a new entry with a single timestamped value and an initially empty vertical list is added to the map.

If an entry already exists for the key, then an update may occur, depending on the most recent timestamp.

If the new timestamp is less recent, then the new value is outdated and the map will be maintained as is.

Otherwise, the most recent value is appended to the vertical list and the new value and timestamp are added to the map's entry.

</small> {{< /speaker_note >}}

</section>

---

<section>

## Client Reasoning

<small> (continue below) </small>

{{< speaker_note >}} <small>

Although logical atomicity ensures that operations on JellyFish are correct, it does not provide a way to directly reason about functional properties relevant for client programs. I'll now discuss how to reason about shared resources and how to combine thread-local operations to obtain a global view of the shared state.

</small> {{< /speaker_note >}}

---

### Shared Resources

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>Shared resources are expressed in Iris through invariants.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>Invariant resources can be accessed during logically atomic operations.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>The invariant containing $\textsf{VCMap}$ is abstracted by another predicate.</small>
  {{< /fragment >}}

  {{< fragment weight=4 >}}
  <small>The shared state must not be described by a specific abstract map.</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=3 class=fade-out >}}
  {{< fragment weight=1 >}}
  <span class="inv">
  $ I $
  </span><sup class="name">$ \ \mathcal{N} $</sup>
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=3 >}}
  $ \textsf{IsMap}(p, \Gamma) $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

To reason about shared resources, Iris allows the definition of invariants.

Iris invariants ensure that invariant assertions on shared resources do not break by only allowing temporary access to these shared resources during atomic instructions. The same can be done for logically atomic operations as these can be reasoned about as if they were atomic.

A new representation predicate is defined to abstract an Iris invariant protecting a VCMap resource.

This invariant represents the shared state which cannot be tied to a specific map abstraction, unlike VCMap.

</small> {{< /speaker_note >}}

---

### Private Views

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>Knowledge of the map's state is obtained through thread-local views of the map.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>A view refers to a fraction of the map which may be mutable or constant.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>Views can be split into more views of the *same type* with smaller fractions.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>Partial views can be combined to obtain the full fraction of the map.</small>
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <small>Both types of view are interchangeable when in possession of the full fraction.</small>
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <small>With constant views we can verify clients which perform concurrent reads.</small>
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  <small>Mutable views allow reasoning about concurrent updates to the map.</small>
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  <small>How can we handle conflicting updates and inconsistent views?</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ \textsf{MutMap}(m, q, \Gamma) \qquad \qquad \textsf{ConMap}(m, q, \Gamma) $
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \textsf{MutMap}(m, \textcolor{red}{q}, \Gamma) \qquad \qquad \textsf{ConMap}(m, \textcolor{red}{q}, \Gamma) $
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $ q = q_1 + q_2 $
  {{< /fragment >}}

  {{< fragment weight=6 class=fade-out >}}
  {{< fragment weight=4 >}}
  $ q = 1 $
  {{< /fragment >}}
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  $ \textsf{ConMap}(m, q, \Gamma) $
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  $ \textsf{MutMap}(m, q, \Gamma) $
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  $ \textsf{MutMap}(m_1, q_1, \Gamma) * \textsf{MutMap}(m_2, q_2, \Gamma) $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

The map's state is described by separate views of the map which can be owned privately by each thread.

Each view is associated with a fraction and views can be either mutable or constant.

A view can be split into other views with smaller fractions, maintaining the same type.

All views can be combined to obtain a full fraction, which corresponds to all knowledge we hold of the map's state.

In this scenario, we can switch between types of views, ensuring that we can switch between read-only and write-only concurrency.

With constant views, threads can perform concurrent reads...

... and with mutable views, threads can perform concurrent updates.

However, how can we reason about conflicting updates which may result in inconsistent views of the map?

</small> {{< /speaker_note >}}

---

### Map Composition

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>We require a composition operator on maps.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>For different keys, the combined map will contain both key-value pairs.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>But what happens when both threads associate different values to the same key?</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>The key will be associated with the composition of both values.</small>
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <small>Value composition should yield the most recent value.</small>
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <small>If $i < j$, then the pair with value $a$ is discarded, returning the pair with value $b$.</small>
  {{< /fragment >}}

  {{< fragment weight=7 class=current-visible >}}
  <small>For equal timestamps, both values are possible, depending on the scheduler.</small>
  {{< /fragment >}}

  {{< fragment weight=8 >}}
  <small>As a result, the abstract map associates each key to a *set* of possible values.</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ m_1 \cdot m_2 $
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \\{ \ k_1 : x \ \\} \cup \\{ \ k_2 : y \ \\} $
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $ \\{ \ k : x \ \\} \cup \\{ \ k : y \ \\} $
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $ \\{ \ k : x \cdot y \ \\} $
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <font size="5">The $\textsf{argmax}$ operator returns that value.</font>
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  $ \textsf{prodZ}(a, i) \cdot \textsf{prodZ}(b, j) = \textsf{prodZ}(b, j) $
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  $ \textsf{prodZ}(a, i) \cdot \textsf{prodZ}(b, i) = \textsf{prodZ}(a \cup b, i) $
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

We reason about such inconsistencies through a composition operator on maps.

If the views hold no key in common, then the combined map is simply a map containing all key-value pairs of both views.

However, when there exists some key in common, the associated value may differ in both views. 

This issue can be resolved by returning a new map entry where the associated value is the composition of both values.

As we've seen previously, a search will always return the most recent value associated with the key. The abstract map should thus associate each key to the value with the greatest timestamp, meaning that value composition should be done through the argmax operator.

Values should be represented as pairs, where timestamp "j" being greater than timestamp "i" returns the pair with value "b", discarding the value "a".

However, when both timestamps are equal, the last value to be written will depend on the scheduler. As such, both "a" and "b" may be the value associated with the key, so ...

... we require "a" and "b" to be sets rather than the actual values. In that way, we can maintain each key associated with all possible values, along with the corresponding timestamp "i".

</small> {{< /speaker_note >}}

---

### Updates and Lookups

<div class="r-stack">
  {{< fragment weight=1 class=current-visible >}}
  <small>The map is updated by composition with the new timestamped entry for the key.</small>
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  <small>The key is mapped to a singleton set containing the new value.</small>
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  <small>Lookups to the map will depend on the following case analysis.</small>
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  <small>The return result $o$ will be empty if the key is not in the map.</small>
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  <small>Otherwise, some timestamped value is returned.</small>
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  <small>The returned value must belong to some set of values, ...</small>
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  <small>... which corresponds to the set stored in the abstract state of the map.</small>
  {{< /fragment >}}
</div>

<div class="r-stack smath">
  {{< fragment weight=1 class=current-visible >}}
  $ \begin{array}{l} m \cdot \\{ \ k : \textsf{prodZ}(\\{ v \\}, t) \ \\} \\\\ \ \\\\ \ \end{array}$
  {{< /fragment >}}

  {{< fragment weight=2 class=current-visible >}}
  $ \begin{array}{l} m \cdot \\{ \ k : \textsf{prodZ}(\textcolor{red}{\\{ v \\}}, t) \ \\} \\\\ \ \\\\ \ \end{array}$
  {{< /fragment >}}

  {{< fragment weight=3 class=current-visible >}}
  $ \begin{array}{l} \textsf{\textbf{match}} \ m[k] \ \textsf{\textbf{with}} \\\\ | \ \textsf{None} \Rightarrow o = \textsf{None} \\\\ | \ \textsf{Some}(a) \Rightarrow \exists \ vs, v, t. \ a = \textsf{prodZ}(vs, t) * v \in vs * o = \textsf{Some}(v, t) \end{array}$
  {{< /fragment >}}

  {{< fragment weight=4 class=current-visible >}}
  $ \begin{array}{l} \textsf{\textbf{match}} \ \textcolor{red}{m[k]} \ \textsf{\textbf{with}} \\\\ | \ \textcolor{red}{\textsf{None}} \Rightarrow \textcolor{blue}{o = \textsf{None}} \\\\ | \ \textsf{Some}(a) \Rightarrow \exists \ vs, v, t. \ a = \textsf{prodZ}(vs, t) * v \in vs * o = \textsf{Some}(v, t) \end{array}$
  {{< /fragment >}}

  {{< fragment weight=5 class=current-visible >}}
  $ \begin{array}{l} \textsf{\textbf{match}} \ \textcolor{red}{m[k]} \ \textsf{\textbf{with}} \\\\ | \ \textsf{None} \Rightarrow o = \textsf{None} \\\\ | \ \textcolor{red}{\textsf{Some}(a)} \Rightarrow \exists \ vs, v, t. \ a = \textsf{prodZ}(vs, t) * v \in vs * \textcolor{blue}{o = \textsf{Some}(v, t)} \end{array}$
  {{< /fragment >}}

  {{< fragment weight=6 class=current-visible >}}
  $ \begin{array}{l} \textsf{\textbf{match}} \ m[k] \ \textsf{\textbf{with}} \\\\ | \ \textsf{None} \Rightarrow o = \textsf{None} \\\\ | \ \textsf{Some}(a) \Rightarrow \exists \ vs, v, t. \ a = \textsf{prodZ}(vs, t) * \textcolor{green}{v \in vs} * o = \textsf{Some}(v, t) \end{array}$
  {{< /fragment >}}

  {{< fragment weight=7 >}}
  $ \begin{array}{l} \textsf{\textbf{match}} \ m[k] \ \textsf{\textbf{with}} \\\\ | \ \textsf{None} \Rightarrow o = \textsf{None} \\\\ | \ \textsf{Some}(a) \Rightarrow \exists \ vs, v, t. \ \textcolor{green}{a = \textsf{prodZ}(vs, t)} * v \in vs * o = \textsf{Some}(v, t) \end{array}$
  {{< /fragment >}}
</div>

{{< speaker_note >}} <small>

Since map composition will handle all conflicts, updates to the map can be expressed through composition with a singleton entry for the key with its new timestamped value ...

... which is initially kept in its own singleton set.

Since we can only ensure that each key is mapped to a set of possible values, lookups can now be defined as follows.

The search will come up empty if there is no map entry for the key.

Otherwise, some timestamped value will be returned ...

... which belongs to the set of values ...

.. stored in the map associated with the same timestamp.

</small> {{< /speaker_note >}}

</section>

---

<section>

## Conclusion

<small> (continue below) </small>

{{< speaker_note >}} <small>

To conclude, this work contributes to the understanding of complex nested data structures, providing a new approach for reasoning about concurrent maps.

</small> {{< /speaker_note >}}

---

### Contributions

{{< fragment >}}
<small><li>The first verification effort for the JellyFish skip list.</li></small>
{{< /fragment >}}

{{< fragment >}}
<small><li>A compositional approach for defining map specifications.</li></small>
{{< /fragment >}}

{{< fragment >}}
<small><li>An alternative interpretation of logical atomicity defined in [Iris](https://iris-project.org/).</li></small>
{{< /fragment >}}

{{< speaker_note >}} <small>

As for the main contributions I highlight:

The first verification effort of the JellyFish design for concurrent append-only skip lists.

A compositional approach for defining map specifications suitable for verifying client programs.

And an alternative interpretation of logical atomicity which allows compositional reasoning about shared resources after an operation’s linearization point.

</small> {{< /speaker_note >}}

</section>

---

# Thank you!

{{< speaker_note >}} <small>

Thank you for your attention and I am now available to answer any questions you may have.

</small> {{< /speaker_note >}}