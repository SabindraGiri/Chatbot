import sys
from ctransformers import AutoModelForCausalLM

sys.stdout.reconfigure(encoding='utf-8')

user_input = sys.argv[1] if len(sys.argv) > 1 else "Hello"

try:
    model = AutoModelForCausalLM.from_pretrained(
        ".", 
        model_file="openchat-3.5.Q4_K_M.gguf", 
        model_type="llama"
    )
    prompt = f"<|user|>\n{user_input}\n<|assistant|>\n"
    response = model(prompt, max_new_tokens=256, stop=["<|user|>", "<|assistant|>", "<|system|>"])
    print(response.strip())

except Exception as e:
    print(f"❌ Error loading model or generating response: {str(e)}")
