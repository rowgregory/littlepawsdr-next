-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "BidderStatus" AS ENUM ('REGISTERED', 'ACTIVE', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('TOP_BID', 'OUTBID');

-- CreateEnum
CREATE TYPE "SellingFormat" AS ENUM ('AUCTION', 'FIXED', 'BOTH');

-- CreateEnum
CREATE TYPE "AuctionItemStatus" AS ENUM ('UNSOLD', 'ACTIVE', 'SOLD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "WinningBidPaymentStatus" AS ENUM ('AWAITING_PAYMENT', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PENDING_FULFILLMENT', 'PENDING_PAYMENT_CONFIRMATION', 'SHIPPED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERUSER', 'ADMIN', 'SUPPORTER');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ONE_TIME_DONATION', 'RECURRING_DONATION', 'ADOPTION_FEE', 'ECARD', 'PRODUCT', 'WELCOME_WIENER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'CONFIRMED', 'CANCELLED', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "OrderItemType" AS ENUM ('ONE_TIME_DONATION', 'RECURRING_DONATION', 'ADOPTION_FEE', 'ECARD', 'PRODUCT', 'WELCOME_WIENER');

-- CreateEnum
CREATE TYPE "EcardTheme" AS ENUM ('BIRTHDAY', 'LOVE', 'CELEBRATION', 'NATURE', 'COZY', 'MUSIC');

-- CreateEnum
CREATE TYPE "EcardBackground" AS ENUM ('GRADIENT_SUNSET', 'GRADIENT_OCEAN', 'GRADIENT_FOREST', 'GRADIENT_LAVENDER', 'GRADIENT_GOLDEN', 'GRADIENT_NIGHT');

-- CreateEnum
CREATE TYPE "EcardFont" AS ENUM ('ELEGANT', 'MODERN', 'PLAYFUL', 'SCRIPT');

-- CreateEnum
CREATE TYPE "EcardIcon" AS ENUM ('GIFT', 'HEART', 'STAR', 'SPARKLES', 'SUN', 'MOON', 'FLOWER', 'COFFEE', 'MUSIC');

-- CreateEnum
CREATE TYPE "RecurringFrequency" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipPostalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "type" "AddressType" NOT NULL DEFAULT 'SHIPPING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "emailVerified" TIMESTAMP(3),
    "metadata" JSONB,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "cardholderName" TEXT,
    "cardBrand" TEXT NOT NULL,
    "cardLast4" TEXT NOT NULL,
    "cardExpMonth" INTEGER NOT NULL,
    "cardExpYear" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "type" "OrderType" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paymentMethodId" TEXT,
    "paymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "coverFees" BOOLEAN NOT NULL DEFAULT false,
    "feesCovered" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "failureReason" TEXT,
    "failureCode" TEXT,
    "userId" TEXT,
    "stripeSubscriptionId" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringFrequency" "RecurringFrequency",
    "nextBillingDate" TIMESTAMP(3),
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipPostalCode" TEXT,
    "country" TEXT,
    "isPhysical" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "OrderItemType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER,
    "subtotal" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),
    "isPhysical" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "itemName" TEXT,
    "itemImage" TEXT,
    "images" TEXT[],
    "age" TEXT,
    "recipientsFullName" TEXT,
    "recipientsEmail" TEXT,
    "dateToSend" TIMESTAMP(3),
    "senderName" TEXT,
    "recipientName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'DRAFT',
    "goal" DECIMAL(10,2) NOT NULL DEFAULT 1000,
    "totalAuctionRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "supporters" INTEGER NOT NULL DEFAULT 0,
    "supporterEmails" TEXT[],
    "customAuctionLink" TEXT,
    "anonymousBidding" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionItem" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sellingFormat" "SellingFormat" NOT NULL,
    "startingPrice" DECIMAL(10,2),
    "buyNowPrice" DECIMAL(10,2),
    "currentPrice" DECIMAL(10,2),
    "currentBid" DECIMAL(10,2),
    "minimumBid" DECIMAL(10,2),
    "highestBidAmount" DECIMAL(10,2),
    "soldPrice" DECIMAL(10,2),
    "retailValue" TEXT,
    "totalQuantity" INTEGER,
    "totalBids" INTEGER NOT NULL DEFAULT 0,
    "requiresShipping" BOOLEAN NOT NULL DEFAULT true,
    "shippingCosts" DECIMAL(10,2),
    "status" "AuctionItemStatus" NOT NULL DEFAULT 'UNSOLD',
    "topBidder" TEXT,
    "itemBtnText" TEXT,
    "isAuction" BOOLEAN NOT NULL DEFAULT false,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionItemPhoto" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "size" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionItemPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionBidder" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "BidderStatus" NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionBidder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionBid" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "auctionItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "bidAmount" DECIMAL(10,2) NOT NULL,
    "bidderName" TEXT,
    "email" TEXT,
    "status" "BidStatus" NOT NULL DEFAULT 'TOP_BID',
    "sentWinnerEmail" BOOLEAN NOT NULL DEFAULT false,
    "emailCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionBid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionItemInstantBuyer" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "auctionItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "totalPrice" DECIMAL(10,2),
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "shippingStatus" "ShippingStatus" NOT NULL DEFAULT 'PENDING_FULFILLMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionItemInstantBuyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionWinningBidder" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "winningBidPaymentStatus" "WinningBidPaymentStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "auctionItemPaymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "auctionPaymentNotificationEmailHasBeenSent" BOOLEAN NOT NULL DEFAULT false,
    "emailNotificationCount" INTEGER NOT NULL DEFAULT 0,
    "elapsedTimeSinceAuctionItemWon" TEXT,
    "processingFee" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),
    "itemSoldPrice" DECIMAL(10,2),
    "shipping" DECIMAL(10,2),
    "shippingStatus" "ShippingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT_CONFIRMATION',
    "shippingProvider" TEXT,
    "trackingNumber" TEXT,
    "payPalId" TEXT,
    "paidOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionWinningBidder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdoptionApplicationBypassCode" (
    "id" TEXT NOT NULL,
    "bypassCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionApplicationBypassCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ecard" (
    "id" TEXT NOT NULL,
    "recipientsFullName" TEXT NOT NULL,
    "recipientsEmail" TEXT NOT NULL,
    "senderName" TEXT,
    "message" TEXT,
    "dateToSend" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "theme" "EcardTheme",
    "background" "EcardBackground",
    "font" "EcardFont",
    "icon" "EcardIcon",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ecard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "images" TEXT[],
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shippingPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "countInStock" INTEGER NOT NULL DEFAULT 0,
    "isOutOfStock" BOOLEAN,
    "isPhysicalProduct" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WelcomeWiener" (
    "id" TEXT NOT NULL,
    "displayUrl" TEXT,
    "name" TEXT,
    "bio" TEXT,
    "age" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "isDogBoost" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[],
    "isPhysicalProduct" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "associatedProducts" JSONB[],

    CONSTRAINT "WelcomeWiener_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "newsletterEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuctionItemToAuctionWinningBidder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "Address_userId_isDefault_idx" ON "Address"("userId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_stripePaymentId_key" ON "PaymentMethod"("stripePaymentId");

-- CreateIndex
CREATE INDEX "PaymentMethod_userId_idx" ON "PaymentMethod"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSubscriptionId_key" ON "Order"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Order_type_idx" ON "Order"("type");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "AuctionItem_auctionId_idx" ON "AuctionItem"("auctionId");

-- CreateIndex
CREATE INDEX "AuctionItemPhoto_itemId_idx" ON "AuctionItemPhoto"("itemId");

-- CreateIndex
CREATE INDEX "AuctionBidder_auctionId_idx" ON "AuctionBidder"("auctionId");

-- CreateIndex
CREATE INDEX "AuctionBidder_userId_idx" ON "AuctionBidder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionBidder_auctionId_userId_key" ON "AuctionBidder"("auctionId", "userId");

-- CreateIndex
CREATE INDEX "AuctionBid_auctionId_idx" ON "AuctionBid"("auctionId");

-- CreateIndex
CREATE INDEX "AuctionBid_auctionItemId_idx" ON "AuctionBid"("auctionItemId");

-- CreateIndex
CREATE INDEX "AuctionBid_userId_idx" ON "AuctionBid"("userId");

-- CreateIndex
CREATE INDEX "AuctionItemInstantBuyer_auctionId_idx" ON "AuctionItemInstantBuyer"("auctionId");

-- CreateIndex
CREATE INDEX "AuctionItemInstantBuyer_auctionItemId_idx" ON "AuctionItemInstantBuyer"("auctionItemId");

-- CreateIndex
CREATE INDEX "AuctionWinningBidder_auctionId_idx" ON "AuctionWinningBidder"("auctionId");

-- CreateIndex
CREATE INDEX "AuctionWinningBidder_userId_idx" ON "AuctionWinningBidder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdoptionApplicationBypassCode_bypassCode_key" ON "AdoptionApplicationBypassCode"("bypassCode");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_newsletterEmail_key" ON "Newsletter"("newsletterEmail");

-- CreateIndex
CREATE UNIQUE INDEX "_AuctionItemToAuctionWinningBidder_AB_unique" ON "_AuctionItemToAuctionWinningBidder"("A", "B");

-- CreateIndex
CREATE INDEX "_AuctionItemToAuctionWinningBidder_B_index" ON "_AuctionItemToAuctionWinningBidder"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionItem" ADD CONSTRAINT "AuctionItem_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionItemPhoto" ADD CONSTRAINT "AuctionItemPhoto_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AuctionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBidder" ADD CONSTRAINT "AuctionBidder_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBidder" ADD CONSTRAINT "AuctionBidder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_auctionItemId_fkey" FOREIGN KEY ("auctionItemId") REFERENCES "AuctionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "AuctionBidder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionItemInstantBuyer" ADD CONSTRAINT "AuctionItemInstantBuyer_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionItemInstantBuyer" ADD CONSTRAINT "AuctionItemInstantBuyer_auctionItemId_fkey" FOREIGN KEY ("auctionItemId") REFERENCES "AuctionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionItemInstantBuyer" ADD CONSTRAINT "AuctionItemInstantBuyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionWinningBidder" ADD CONSTRAINT "AuctionWinningBidder_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionWinningBidder" ADD CONSTRAINT "AuctionWinningBidder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctionItemToAuctionWinningBidder" ADD CONSTRAINT "_AuctionItemToAuctionWinningBidder_A_fkey" FOREIGN KEY ("A") REFERENCES "AuctionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctionItemToAuctionWinningBidder" ADD CONSTRAINT "_AuctionItemToAuctionWinningBidder_B_fkey" FOREIGN KEY ("B") REFERENCES "AuctionWinningBidder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
