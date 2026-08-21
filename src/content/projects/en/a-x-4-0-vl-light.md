---
title: "A.X-4.0-VL-Light"
summary: "SK Telecom's open-source Vision Language Model built on the A.X-4.0-Light LLM, optimized for Korean vision-language understanding and enterprise deployment."
logo: "../_assets/ax-vl-logo.png"
cover: "../_assets/ax-vl-benchmark.png"
org: "SK Telecom"
role: "Vision-Language Model Development"
startDate: 2024-01-01
endDate: 2025-05-01
tags: ["VLM", "Multimodal", "Korean", "Open Source", "Evaluation"]
links:
  - label: "Models"
    url: "https://huggingface.co/collections/skt/ax-4-68637ebaa63b9cc51925e886"
    kind: "huggingface"
  - label: "GitHub"
    url: "https://github.com/SKT-AI/A.X-4.0-VL-Light"
    kind: "github"
featured: true
---

## My Contributions

- Defined the model's direction and strengths by focusing on token efficiency and enhanced understanding of Korean culture and Korean-language documents.
- Developed the training pipeline, reviewing frameworks such as Megatron-LM, NeMo, and DeepSpeed.
- Designed and validated training strategies based on PLM and instruction-tuned models.
- Selected the VLM architecture to highlight the strengths of the A.X-4.0-VL model.
- Coordinated external collaborations for academic evaluations, Korean document understanding, and the development of a proprietary VLM benchmark for domestic certifications.
- Built a comprehensive evaluation pipeline integrating the proprietary benchmark, AI Hub datasets, and lmms-eval for VLM performance assessment.

## What is A.X-4.0-VL-Light?

A.X 4.0 VL Light (pronounced "A dot X") is a vision-language model (VLM) optimized for Korean vision and language understanding as well as enterprise deployment. Built upon A.X 4.0 Light, it has been further trained on diverse multimodal datasets, with a particular focus on large-scale multimodal Korean datasets, to deliver strong performance in domestic business applications.

## Results

- **Superior Korean proficiency in vision and language** — Achieved an average score of 79.4 on Korean image benchmarks, outperforming Qwen2.5-VL-32B (73.4) despite a significantly smaller model size. On Korean text benchmarks, recorded an average of 60.2, comparable to VARCO-VISION-2.0-14B (60.4) while using only half the model size.
- **Deep cultural understanding** — Scored 80.2 on K-Viscuit, a multimodal benchmark for cultural and contextual comprehension in Korean, exceeding Qwen2.5-VL-32B (72.3).
- **Advanced document understanding** — Attained 89.8 on KoBizDoc, a benchmark focused on complex document structures including charts and tables, performing comparably to Qwen2.5-VL-32B (88.8).
- **Efficient token usage** — Uses approximately 41% fewer text tokens than Qwen2.5-VL for the same Korean input, enabling more cost-effective processing.
