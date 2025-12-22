import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react-native';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
    status?: 'sent' | 'delivered' | 'read';
}

export const SupportChatScreen = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Initial welcome message
        setTimeout(() => {
            addBotMessage("Welcome to WhatNot Support! 🌟\nHow can we help you today?");
        }, 500);
    }, []);

    const addBotMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setMessages(prev => [...prev, userMsg]);
        const userText = inputText.toLowerCase();
        setInputText('');

        // Simulate bot typing and reply
        setTimeout(() => {
            // Update user message to read
            setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'read' } : m));

            let reply = "Thanks for reaching out! One of our agents will be with you shortly.";

            if (userText.includes('shipping') || userText.includes('delivery')) {
                reply = "Orders typically ship within 2-3 business days. You can track your shipment in the Profile > Orders section.";
            } else if (userText.includes('refund') || userText.includes('return')) {
                reply = "For refunds, please provide your Order ID. Our policy allows returns within 7 days of delivery for damaged items.";
            } else if (userText.includes('bid') || userText.includes('auction')) {
                reply = "Having trouble with bidding? Make sure your wallet has sufficient funds. Bids placed are binding and cannot be cancelled.";
            } else if (userText.includes('hello') || userText.includes('hi')) {
                reply = "Hello! 👋 How can I assist you with your shopping experience today?";
            }

            addBotMessage(reply);
        }, 1500);
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View className={`flex-row ${item.isUser ? 'justify-end' : 'justify-start'} mb-3 mx-3`}>
            <View
                className={`max-w-[80%] p-3 rounded-2xl ${item.isUser
                        ? 'bg-[#DCF8C6] rounded-tr-none' // WhatsApp Light Green
                        : 'bg-white rounded-tl-none'
                    } shadow-sm`}
            >
                <Text className="text-base text-gray-800 leading-5">{item.text}</Text>
                <View className="flex-row justify-end items-center mt-1">
                    <Text className="text-[10px] text-gray-500 mr-1">{item.timestamp}</Text>
                    {item.isUser && (
                        <Text className="text-[10px] text-blue-500 font-bold">
                            {item.status === 'read' ? '✓✓' : '✓'}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#ECE5DD]" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-2 py-3 bg-[#075E54]">
                <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center mr-2">
                    <ArrowLeft color="white" size={24} />
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png' }}
                        className="w-9 h-9 rounded-full bg-white ml-1"
                    />
                </TouchableOpacity>
                <View className="flex-1 ml-2">
                    <Text className="text-white font-bold text-lg">WhatNot Support</Text>
                    <Text className="text-white/80 text-xs">Online</Text>
                </View>
                <View className="flex-row gap-5 mr-2">
                    <Video color="white" size={22} />
                    <Phone color="white" size={22} />
                    <MoreVertical color="white" size={22} />
                </View>
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingVertical: 16 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View className="flex-row items-center p-2 bg-transparent pb-4">
                    <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-2 mr-2 shadow-sm min-h-[45px]">
                        <TouchableOpacity>
                            <Smile color="gray" size={24} />
                        </TouchableOpacity>
                        <TextInput
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Message"
                            className="flex-1 mx-2 text-base text-black"
                            multiline
                        />
                        <TouchableOpacity className="mr-3">
                            <Paperclip color="gray" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <CameraIcon />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleSend}
                        className="bg-[#075E54] w-12 h-12 rounded-full items-center justify-center shadow-md"
                    >
                        <Send color="white" size={20} className="ml-0.5" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const CameraIcon = () => (
    <View className="w-5 h-5 rounded-full border-2 border-gray-400" />
); // Quick mock icon if lucide Camera is missing or simply purely visual
