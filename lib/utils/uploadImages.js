const useUploadImages = () => {
  useCallback(
    async (files) => {
      const images = [];
      const downloadURLPromises = [];

      for (const file of files) {
        const imageId = crypto.randomUUID();
        const storageRef = ref(
          storage,
          `${user.uid}/userID_${user.uid}_${imageId}`
        );

        // Upload the file
        const result = await uploadFile(storageRef, file, {
          contentType: "image/jpeg",
        });
        setProcessingCount((prevCount) => prevCount + 1);

        // Get download URL
        const downloadUrlPromise = getDownloadURL(storageRef).then((url) => {
          images.push({
            id: imageId,
            link: url,
            timeCreated: result.metadata.timeCreated,
          });
        });
        downloadURLPromises.push(downloadUrlPromise);
      }

      await Promise.all(downloadURLPromises);

      // Add concepts for each image
      setProcessingAmount(true);

      const conceptPromises = images.map(async (image, i) => {
        try {
          const concepts = await getConcepts(image.link);
          images[i] = { ...image, concepts };
        } catch (error) {
          console.error(error);
        }
      });

      await Promise.all(conceptPromises);

      // Upload file data to user's Firestore
      images.forEach((image) => {
        const imageRef = doc(db, "users", user.uid, "images", image.id);
        setDoc(imageRef, { ...image });
      });

      // Processing finished, display success message
      toast({
        title: "Success!",
        description: "Images uploaded!",
      });
      setProcessingAmount(0);
      setProcessingCount(0);
      setIsDialogOpen(false);
    },
    [
      setIsDialogOpen,
      setProcessingAmount,
      toast,
      uploadFile,
      setProcessingCount,
      user,
    ]
  );
};
