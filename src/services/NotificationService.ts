import { Alert, Platform, ToastAndroid } from 'react-native';

class NotificationService {
    private showNotification(title: string, message: string) {
        console.log(`[WhatsApp Simulation] ${title}: ${message}`);

        // Simulate a push notification / WhatsApp message popping up
        if (Platform.OS === 'android') {
            ToastAndroid.show(`📱 WhatsApp: ${message}`, ToastAndroid.LONG);
        } else {
            // iOS or other
            // Using Alert to ensure visibility for simulation
            // In a real app, this would be a local push notification
            setTimeout(() => {
                Alert.alert(`📱 WhatsApp: ${title}`, message);
            }, 500);
        }
    }

    sendBidPlaced(item: string, amount: number) {
        this.showNotification('Bid Placed', `You placed a bid of ₹${amount} on ${item}.`);
    }

    sendOutbid(item: string, newAmount: number) {
        this.showNotification('Outbid Alert', `⚠️ You've been outbid on ${item}! New highest bid: ₹${newAmount}. Bid now to win!`);
    }

    sendAuctionWon(item: string, price: number) {
        this.showNotification('Auction Won! 🎉', `Congratulations! You won ${item} for ₹${price}. Please complete payment within 5 mins.`);
    }

    sendPaymentReminder(item: string) {
        this.showNotification('Payment Reminder', `⏳ Action Required: Please pay for ${item} to avoid blocking your account.`);
    }

    sendShipmentUpdate(item: string, status: string) {
        this.showNotification('Shipment Update', `📦 Your order for ${item} is now ${status}.`);
    }

    scheduleStreamStart(streamerName: string, delaySeconds: number = 10) {
        setTimeout(() => {
            this.showNotification('Stream Starting! 🔴', `${streamerName} is live now! Don't miss out!`);
        }, delaySeconds * 1000);
    }

    schedulePriceDrop(productName: string, newPrice: number, delaySeconds: number = 10) {
        setTimeout(() => {
            this.showNotification('Price Drop Alert 📉', `${productName} is now available for just ₹${newPrice}! Grab it before it's gone.`);
        }, delaySeconds * 1000);
    }
}

export const notificationService = new NotificationService();
