// import { db } from './firebase';
// import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// // Chatbot service for AI responses
// export class ChatbotService {
//   static COLLECTION_NAME = 'chatHistory';
  
//   // Fallback responses when AI API is not available
//   static getFallbackResponse(message) {
//     const lowerMessage = message.toLowerCase();
    
//     // STEM-related responses
//     if (lowerMessage.includes('science') || lowerMessage.includes('scientific')) {
//       return "Science is the systematic study of the natural world through observation and experimentation. It helps us understand how things work! What specific science topic interests you?";
//     }
    
//     if (lowerMessage.includes('math') || lowerMessage.includes('mathematics') || lowerMessage.includes('calculate')) {
//       return "Mathematics is the language of patterns and relationships. It's everywhere in STEM! Are you working on algebra, geometry, calculus, or something else?";
//     }
    
//     if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('computer')) {
//       return "Technology involves using scientific knowledge to solve problems and create tools. It includes everything from programming to robotics! What tech topic are you curious about?";
//     }
    
//     if (lowerMessage.includes('engineering') || lowerMessage.includes('engineer')) {
//       return "Engineering is about applying science and math to design and build solutions. It combines creativity with technical skills! What kind of engineering interests you?";
//     }
    
//     // Greetings
//     if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
//       return "Hello! I'm your AI STEM tutor. I can help you with Science, Technology, Engineering, and Math questions. What would you like to learn about?";
//     }
    
//     if (lowerMessage.includes('help')) {
//       return "I'm here to help with STEM topics! You can ask me about:\n- Science concepts and experiments\n- Math problems and formulas\n- Technology and programming\n- Engineering principles\n\nWhat would you like to know?";
//     }
    
//     if (lowerMessage.includes('what') && lowerMessage.includes('you')) {
//       return "I'm an AI tutor designed to help with STEM learning. I can explain concepts, help solve problems, and provide learning resources. How can I assist you today?";
//     }
    
//     // Question patterns
//     if (lowerMessage.includes('what is') || lowerMessage.includes('what are')) {
//       return "That's a great question! Could you provide more details? I'd love to give you a comprehensive explanation about this STEM topic.";
//     }
    
//     if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('do'))) {
//       return "I'd be happy to explain how that works! Could you be more specific about what you'd like to understand?";
//     }
    
//     if (lowerMessage.includes('why')) {
//       return "Great question! Understanding the 'why' is important in STEM. Could you clarify what specifically you're curious about?";
//     }
    
//     // Default responses
//     if (lowerMessage.includes('thank')) {
//       return "You're welcome! Feel free to ask if you have more questions about STEM topics.";
//     }
    
//     return "That's an interesting question! I'm here to help with STEM topics. Could you ask about Science, Technology, Engineering, or Math? I can explain concepts, help with problems, or guide you through learning resources.";
//   }
  
//   // Get AI response using Google Gemini API (if API key is available)
//   static async getAIResponse(message, userId) {
//     const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
//     // If no API key, use fallback
//     if (!apiKey) {
//       console.log('No Gemini API key found, using fallback responses');
//       return this.getFallbackResponse(message);
//     }
    
//     try {
//       // Use Gemini API endpoint
//       const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: `You are a helpful AI tutor specializing in STEM education. Provide clear, educational responses about Science, Technology, Engineering, and Math. Keep responses concise and engaging (max 300 words).

// User question: ${message}`
//             }]
//           }],
//           generationConfig: {
//             temperature: 0.7,
//             topK: 40,
//             topP: 0.95,
//             maxOutputTokens: 300,
//           },
//         })
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Gemini API error: ${response.status}`, errorText);
//         throw new Error(`Gemini API error: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       // Extract text from Gemini response
//       const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
//       if (reply) {
//         return reply.trim();
//       }
      
//       // Fallback if response format is unexpected
//       console.warn('Unexpected Gemini API response format:', data);
//       return this.getFallbackResponse(message);
//     } catch (error) {
//       console.error('Error fetching AI response from Gemini:', error);
//       // Fallback to rule-based responses
//       return this.getFallbackResponse(message);
//     }
//   }
  
//   // Save chat message to Firestore
//   static async saveMessage(userId, message, sender, reply = null) {
//     try {
//       if (!userId) return;
      
//       const chatRef = doc(db, this.COLLECTION_NAME, userId);
//       const chatDoc = await getDoc(chatRef);
      
//       const newMessage = {
//         text: message,
//         sender: sender,
//         timestamp: serverTimestamp()
//       };
      
//       if (reply) {
//         const aiMessage = {
//           text: reply,
//           sender: 'ai',
//           timestamp: serverTimestamp()
//         };
        
//         if (chatDoc.exists()) {
//           const existingData = chatDoc.data();
//           await updateDoc(chatRef, {
//             messages: [...(existingData.messages || []), newMessage, aiMessage],
//             lastUpdated: serverTimestamp()
//           });
//         } else {
//           await setDoc(chatRef, {
//             userId: userId,
//             messages: [newMessage, aiMessage],
//             createdAt: serverTimestamp(),
//             lastUpdated: serverTimestamp()
//           });
//         }
//       } else {
//         // Just save user message
//         if (chatDoc.exists()) {
//           const existingData = chatDoc.data();
//           await updateDoc(chatRef, {
//             messages: [...(existingData.messages || []), newMessage],
//             lastUpdated: serverTimestamp()
//           });
//         } else {
//           await setDoc(chatRef, {
//             userId: userId,
//             messages: [newMessage],
//             createdAt: serverTimestamp(),
//             lastUpdated: serverTimestamp()
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   }
  
//   // Get chat history from Firestore
//   static async getChatHistory(userId) {
//     try {
//       if (!userId) return [];
      
//       const chatRef = doc(db, this.COLLECTION_NAME, userId);
//       const chatDoc = await getDoc(chatRef);
      
//       if (chatDoc.exists()) {
//         const data = chatDoc.data();
//         // Convert Firestore timestamps to format expected by component
//         return (data.messages || []).map(msg => ({
//           sender: msg.sender,
//           text: msg.text,
//           timestamp: msg.timestamp?.toDate?.() || new Date()
//         }));
//       }
      
//       return [];
//     } catch (error) {
//       console.error('Error loading chat history:', error);
//       return [];
//     }
//   }
  
//   // Send message and get AI response
//   static async sendMessage(userId, message) {
//     try {
//       if (!userId || !message.trim()) {
//         throw new Error('User ID and message are required');
//       }
      
//       // Get AI response
//       const reply = await this.getAIResponse(message.trim(), userId);
      
//       // Save both user message and AI response
//       await this.saveMessage(userId, message.trim(), 'user', reply);
      
//       return reply;
//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error;
//     }
//   }
// }

