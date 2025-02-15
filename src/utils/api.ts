import { ChatResponse } from '../types/chat';

const API_URL =
  'https://chatbot-service-605174661664.us-central1.run.app/chatbot';
const STORE_CONFIG_URL =
  'https://chatbot-service-605174661664.us-central1.run.app/api/store';

interface ErrorResponse {
  error: boolean;
  response: string;
  follow_up_questions: string[];
  products: [];
}

const SILENTSTORM_RESPONSES = [
  `**Security Scan Summary (Completed Today)**
I've completed the latest scan, and here are the highlights:

![Analysis Chart](https://tinyurl.com/3app57m2)

1. **7,000 detections** → Ignored 2,000 (e.g., CVE-2023-25775, not applicable in your cloud environments as the RDMA driver is not in use).

2. **602 detections for CVE-2025-11111 (aka SilentStorm)** in 50 container images—which is actively being exploited.

3. **12 out of the 50 images are participating in attack chains**,that could lead to exfiltration of high-value data.`,
  {
    type: 'combined',
    content: `**Next Steps**
    
1. **Created tickets for all 12 container images**—with full context and recommended remediation steps.
2. Here’s how they break down by team:`,
    table: {
      data: [
        { unit: 'Data Insights', count: 5, link: 'https://jira.example.com/browse/CLOUD-123' },
        { unit: 'Payment Automation', count: 3, link: 'https://jira.example.com/browse/APPSEC-456' },
        { unit: 'Platform Engineering', count: 4, link: 'https://jira.example.com/browse/PLAT-789' }
      ]
    }
  }
];

const SILENTSTORM_FOLLOW_UP_QUESTIONS = [
  "Show me an attack chain for CVE-2025-11111 (SilentStorm)",
  "Are there active proof-of-concept (PoC) exploits available?"
];

const MITIGATION_FOLLOW_UP_QUESTIONS = [
  "How can I verify if the rule is working and blocking threats?",
  "Which other assets have had similar rules applied?",
  "Where can I view logs for blocked requests?"
];

const ATTACK_CHAINS_FOLLOW_UP_QUESTIONS = [
  "Apply mitigation for CVE-2025-11111 (SilentStorm)",
  "How to remediate the attack chain?",
  "Is customer-frontend participating in other attack chains?"
];

const MITIGATION_RESPONSE = `AWS WAF protection for CVE-2025-11111 (SilentStorm) is now enabled.

1. **Target**: Web ACL ECS-WAF-SilentStorm-Protection attached to ALB (ecs-task-alb-123456).
2. **Rule Applied**: AWSManagedRulesKnownBadInputsRuleSet → Blocking CVE-2025-11111 exploits.
3. **Logging & Monitoring**: CloudWatch Logs & Metrics enabled for tracking.
4. **Additional Coverage**: Similar rules have been applied to other affected assets in your environment.
`;

const ATTACK_CHAINS_RESPONSE = `
**Attack Chain Summary**

1. **Initial Access**: Attacker gains access to **web-frontend**, an internet-reachable workload vulnerable to CVE-2025-11111 (SilentStorm).

2. **Lateral Movement**: From **web-frontend**, attacker moves laterally to **api**. From **api** the attacker laterally moves to **chatbot-langchain-vm**.

3. **Exfiltration**: Using the permissions of the attached **chatbot-iam-s3-read** role, high value data is downloaded from **chat-history** and exfiltrated via **api**, which has egress access.

Would you like me to a apply mitigation while fixes are in progress?

![Attack Chain Diagram](https://tinyurl.com/569mb32n)`;

const TYPING_DELAY = 4000; // 4 seconds delay

export async function fetchChatResponse(message: string) {
  try {
    // Add consistent typing delay for all responses
    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));

    // Check if message contains "attack chain" or "attack chains"
    const lowercaseMessage = message.toLowerCase();
    if (lowercaseMessage.includes('attack chain') || lowercaseMessage.includes('attack chains')) {
      return {
        error: false,
        response: ATTACK_CHAINS_RESPONSE,
        follow_up_questions: ATTACK_CHAINS_FOLLOW_UP_QUESTIONS,
        products: []
      };
    }

    // Check if message contains "mitigation"
    if (lowercaseMessage.includes('mitigation')) {
      return {
        error: false,
        response: MITIGATION_RESPONSE,
        follow_up_questions: MITIGATION_FOLLOW_UP_QUESTIONS,
        products: []
      };
    }

    // Check if message contains "SilentStorm" or "vulnerability management"
    if (lowercaseMessage.includes('silentstorm') || lowercaseMessage.includes('vulnerability management')) {
      return {
        error: false,
        response: SILENTSTORM_RESPONSES[0],
        follow_up_questions: SILENTSTORM_FOLLOW_UP_QUESTIONS,
        products: [],
        silentstorm_responses: SILENTSTORM_RESPONSES.slice(1)
      };
    }

    const conversationId = localStorage.getItem('conversationId');
    const payload = {
      message,
      store_id: 'averlon-demo',
      conversation_id: conversationId,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        error: true,
        response:
          "I'm having trouble connecting to the server right now. Please try again in a moment.",
        follow_up_questions: [],
        products: [],
      } as ErrorResponse;
    }

    const data = await response.json();

    if (data.conversation_id) {
      localStorage.setItem('conversationId', data.conversation_id);
    }

    return { error: false, ...data };
  } catch (error) {
    return {
      error: true,
      response:
        "I'm having trouble connecting to the server right now. Please try again in a moment.",
      follow_up_questions: [],
      products: [],
    } as ErrorResponse;
  }
}

export async function fetchStoreConfig() {
  try {
    const response = await fetch(STORE_CONFIG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        store_id: 'averlon-demo',
      }),
    });

    if (!response.ok) {
      console.warn(
        'Store config fetch failed:',
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Store config fetch error:', error);
    return null;
  }
}