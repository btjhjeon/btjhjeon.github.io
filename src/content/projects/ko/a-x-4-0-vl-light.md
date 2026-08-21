---
title: "A.X-4.0-VL-Light"
summary: "A.X-4.0-Light LLM을 기반으로 개발한 SK텔레콤의 오픈소스 비전 언어 모델. 한국어 시각·언어 이해와 기업 환경 배포에 최적화했습니다."
logo: "../_assets/ax-vl-logo.png"
cover: "../_assets/ax-vl-benchmark.png"
org: "SK텔레콤"
role: "비전 언어 모델 개발"
startDate: 2024-01-01
endDate: 2025-05-01
tags: ["VLM", "Multimodal", "Korean", "Open Source", "Evaluation"]
links:
  - label: "모델"
    url: "https://huggingface.co/collections/skt/ax-4-68637ebaa63b9cc51925e886"
    kind: "huggingface"
  - label: "GitHub"
    url: "https://github.com/SKT-AI/A.X-4.0-VL-Light"
    kind: "github"
featured: true
---

## 기여 내용

- 토큰 효율성과 한국 문화·한국어 문서 이해력 강화에 초점을 맞춰 모델의 방향성과 강점을 정의했습니다.
- Megatron-LM, NeMo, DeepSpeed 등의 프레임워크를 검토하며 학습 파이프라인을 구축했습니다.
- PLM 및 instruction-tuned 모델을 기반으로 학습 전략을 설계하고 검증했습니다.
- A.X-4.0-VL 모델의 강점이 드러나도록 VLM 아키텍처를 선정했습니다.
- 학술 평가, 한국어 문서 이해, 국내 자격시험 기반 자체 VLM 벤치마크 개발을 위한 외부 협업을 조율했습니다.
- 자체 벤치마크와 AI Hub 데이터셋, lmms-eval을 통합한 종합 평가 파이프라인을 구축했습니다.

## A.X-4.0-VL-Light란

A.X 4.0 VL Light("에이닷 엑스"로 읽습니다)는 한국어 시각·언어 이해와 기업 환경 배포에 최적화된 비전 언어 모델(VLM)입니다. A.X 4.0 Light를 기반으로 다양한 멀티모달 데이터셋, 특히 대규모 한국어 멀티모달 데이터셋을 중심으로 추가 학습하여 국내 비즈니스 응용에서 높은 성능을 확보했습니다.

## 성과

- **한국어 시각·언어 성능 우위** — 한국어 이미지 벤치마크 평균 79.4점으로, 모델 크기가 훨씬 작음에도 Qwen2.5-VL-32B(73.4)를 앞섰습니다. 한국어 텍스트 벤치마크에서는 평균 60.2점으로 절반 크기의 모델로 VARCO-VISION-2.0-14B(60.4)에 근접했습니다.
- **문화적 이해도** — 한국어 문화·맥락 이해를 평가하는 멀티모달 벤치마크 K-Viscuit에서 80.2점을 기록해 Qwen2.5-VL-32B(72.3)를 상회했습니다.
- **문서 이해 능력** — 차트·표를 포함한 복잡한 문서 구조 이해를 평가하는 KoBizDoc에서 89.8점을 획득해 Qwen2.5-VL-32B(88.8)와 동등한 수준을 보였습니다.
- **토큰 효율성** — 동일한 한국어 입력에 대해 Qwen2.5-VL보다 텍스트 토큰을 약 41% 적게 사용하여 처리 비용을 크게 낮췄습니다.
