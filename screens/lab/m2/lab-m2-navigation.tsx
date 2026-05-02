import { Routes } from '@/utils/routes';
import React, { useEffect, useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/utils/api/axios-instance';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, Inbox, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react-native';
import { Order, OrderStatus } from '@/screens/commons/orders/orders-screen';

function getStatusInfo(status: OrderStatus) {
    switch (status) {
        case 'request_estimation':
            return { text: 'طلب تسعير جديد', tone: 'bg-amber-50 text-amber-700', icon: <Clock size={14} color="#b45309" /> };
        case 'estimation_provided':
            return { text: 'تم تقديم السعر', tone: 'bg-blue-50 text-blue-700', icon: <Clock size={14} color="#1d4ed8" /> };
        case 'student_negotiation':
            return { text: 'تلقيت اقتراح جديد', tone: 'bg-purple-50 text-purple-700', icon: <AlertCircle size={14} color="#7e22ce" /> };
        case 'lab_negotiation':
            return { text: 'في انتظار رد الطالب', tone: 'bg-orange-50 text-orange-700', icon: <Clock size={14} color="#c2410c" /> };
        case 'confirmed':
            return { text: 'طلب مؤكد', tone: 'bg-indigo-50 text-indigo-700', icon: <CheckCircle2 size={14} color="#4338ca" /> };
        case 'rejected':
            return { text: 'مرفوض', tone: 'bg-rose-50 text-rose-700', icon: <XCircle size={14} color="#be123c" /> };
        case 'completed':
            return { text: 'مكتمل', tone: 'bg-green-50 text-green-700', icon: <CheckCircle2 size={14} color="#15803d" /> };
        default:
            return { text: 'غير معروف', tone: 'bg-slate-50 text-slate-600', icon: <AlertCircle size={14} color="#475569" /> };
    }
}

function isOrderNew(order: Order, type: 'student' | 'lab') {
    const lastViewed = type === 'student' ? order.student_last_viewed_at : order.lab_last_viewed_at;
    if (!lastViewed) return true;
    return new Date(order.updated_at) > new Date(lastViewed);
}

export const LabM2Navigation = () => {
    const navigation = useNavigation<any>();
    const [requestsOrders, setRequestsOrders] = useState<Order[]>([]);
    const [confirmedOrders, setConfirmedOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'requests' | 'confirmed'>('requests');

    const fetchAllOrders = async () => {
        try {
            const [reqRes, confRes]: any = await Promise.all([
                api.get('/lab/orders', { params: { tab: 'requests' } }),
                api.get('/lab/orders', { params: { tab: 'confirmed' } })
            ]);
            if (reqRes.status === 'success') setRequestsOrders(reqRes.data);
            if (confRes.status === 'success') setConfirmedOrders(confRes.data);
        } catch (error) {
            console.error('Error fetching lab orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchAllOrders();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllOrders();
    };

    const newRequestsCount = requestsOrders.filter(o => isOrderNew(o, 'lab') && o.status === 'request_estimation').length;
    const newNegotiationsCount = confirmedOrders.filter(o => isOrderNew(o, 'lab') && o.status === 'student_negotiation').length;

    const currentOrders = activeTab === 'requests' ? requestsOrders : confirmedOrders;

    const handleOrderPress = async (order: Order) => {
        // Optimistic update
        if (isOrderNew(order, 'lab')) {
            const updatedOrder = { ...order, lab_last_viewed_at: new Date().toISOString() };
            if (activeTab === 'requests') {
                setRequestsOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
            } else {
                setConfirmedOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
            }
            try {
                await api.post(`/lab/orders/${order.id}/read`);
            } catch (e) {
                console.error('Failed to mark order as read', e);
            }
        }
        navigation.navigate(Routes.LabOrderDetailScreen, { orderId: order.id });
    };

    const renderOrder = (order: Order) => {
        const statusInfo = getStatusInfo(order.status);
        const studentName = order.student?.full_name || 'طالب غير معروف';
        const studentIcon = order.student?.icon || '👨‍🎓';
        const isNew = isOrderNew(order, 'lab') && (order.status === 'request_estimation' || order.status === 'student_negotiation');

        return (
            <Pressable
                key={order.id}
                className="mb-4 rounded-[28px] bg-white p-5 shadow-sm border border-slate-100"
                onPress={() => handleOrderPress(order)}
                style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                    opacity: pressed ? 0.95 : 1,
                })}>
                <View className="flex-row items-start gap-4">
                    <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                        <Text className="text-3xl">{studentIcon}</Text>
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[10px] text-slate-400 font-medium">{order.created_at.split('T')[0]}</Text>
                            <View className="flex-row items-center gap-2">
                                {isNew && (
                                    <View className="bg-red-500 px-2 py-0.5 rounded-full">
                                        <Text className="text-[10px] text-white font-bold">جديد</Text>
                                    </View>
                                )}
                                <Text className="text-right text-lg font-bold text-slate-800">
                                    {studentName}
                                </Text>
                            </View>
                        </View>

                        <View className="mb-3 mt-1 gap-1 flex-row flex-wrap">
                            {order.items.slice(0, 2).map((item, idx) => (
                                <Text key={item.id} className="text-right text-xs text-slate-500">
                                    {item.product.name_ar}{idx < Math.min(order.items.length, 2) - 1 ? ' • ' : ''}
                                </Text>
                            ))}
                            {order.items.length > 2 && (
                                <Text className="text-xs text-slate-400"> + {order.items.length - 2} عناصر أخرى</Text>
                            )}
                        </View>

                        <View className="flex-row items-center justify-between">
                            <View
                                className={`flex-row items-center gap-1.5 rounded-full px-3 py-1 ${statusInfo.tone}`}>
                                {statusInfo.icon}
                                <Text className="text-[10px] font-bold">{statusInfo.text}</Text>
                            </View>
                            {order.total_price && (
                                <Text className="text-sm font-bold text-teal-600">{order.total_price} DA</Text>
                            )}
                        </View>
                    </View>
                </View>

                {(order.status === 'request_estimation' || order.status === 'student_negotiation') && (
                    <View className="mt-4 border-t border-slate-50 pt-4">
                        <View className="flex-row gap-2">
                            <Pressable
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 items-center justify-center"
                                onPress={() => navigation.navigate(Routes.LabOrderDetailScreen, { orderId: order.id })}
                            >
                                <Text className="text-xs font-bold text-white">
                                    {order.status === 'student_negotiation' ? 'الرد على الاقتراح' : 'تقديم عرض سعر'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <StatusBar barStyle="dark-content" />
            {/* Header */}
            <View className="bg-white px-6 pb-6 pt-5 border-b border-slate-100">
                <View className="flex-row items-center justify-end">
                    <Text className="text-right text-2xl font-black text-slate-900">إدارة الطلبات</Text>
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                        <Inbox size={20} color="#64748b" />
                    </View>
                </View>
                <Text className="mt-1 text-right text-xs text-slate-500">تابع طلبات العملاء وقدم عروض الأسعار</Text>
            </View>

            {/* Tab Bar */}
            <View className="mx-6 mt-2 flex-row rounded-2xl bg-slate-200 p-1">
                <Pressable
                    onPress={() => setActiveTab('requests')}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3`}
                    style={{ backgroundColor: activeTab === 'requests' ? 'white' : 'transparent' }}
                >
                    {newRequestsCount > 0 && (
                        <View className="bg-red-500 rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">{newRequestsCount}</Text>
                        </View>
                    )}
                    <Text className={`text-xs font-bold ${activeTab === 'requests' ? 'text-blue-700' : 'text-slate-500'}`}>
                        طلبات التسعير
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setActiveTab('confirmed')}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3`}
                    style={{ backgroundColor: activeTab === 'confirmed' ? 'white' : 'transparent' }}
                >
                    {newNegotiationsCount > 0 && (
                        <View className="bg-red-500 rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">{newNegotiationsCount}</Text>
                        </View>
                    )}
                    <Text className={`text-xs font-bold ${activeTab === 'confirmed' ? 'text-blue-700' : 'text-slate-500'}`}>
                        الطلبات والتعاقدات
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                contentContainerClassName="px-6 pb-10 pt-6"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
            >
                {loading && !refreshing ? (
                    <View className="mt-20 items-center justify-center">
                        <ActivityIndicator size="large" color="#2563eb" />
                    </View>
                ) : currentOrders.length > 0 ? (
                    currentOrders.map(renderOrder)
                ) : (
                    <View className="mt-20 items-center justify-center px-10">
                        <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
                            <Inbox size={40} color="#cbd5e1" />
                        </View>
                        <Text className="text-center text-lg font-bold text-slate-400">لا توجد طلبات حالياً</Text>
                        <Text className="text-center text-xs text-slate-400 mt-2">ستظهر الطلبات الجديدة هنا فور وصولها</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
