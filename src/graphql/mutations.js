/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      email
      groups {
        nextToken
        __typename
      }
      progress {
        id
        userId
        currentSurah
        currentAyah
        currentJuz
        completedSurahs
        completedJuzs
        totalAyahsRead
        lastUpdated
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      userProgressId
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      email
      groups {
        nextToken
        __typename
      }
      progress {
        id
        userId
        currentSurah
        currentAyah
        currentJuz
        completedSurahs
        completedJuzs
        totalAyahsRead
        lastUpdated
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      userProgressId
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      email
      groups {
        nextToken
        __typename
      }
      progress {
        id
        userId
        currentSurah
        currentAyah
        currentJuz
        completedSurahs
        completedJuzs
        totalAyahsRead
        lastUpdated
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      userProgressId
      __typename
    }
  }
`;
export const createReadingProgress = /* GraphQL */ `
  mutation CreateReadingProgress(
    $input: CreateReadingProgressInput!
    $condition: ModelReadingProgressConditionInput
  ) {
    createReadingProgress(input: $input, condition: $condition) {
      id
      userId
      currentSurah
      currentAyah
      currentJuz
      completedSurahs
      completedJuzs
      totalAyahsRead
      lastUpdated
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateReadingProgress = /* GraphQL */ `
  mutation UpdateReadingProgress(
    $input: UpdateReadingProgressInput!
    $condition: ModelReadingProgressConditionInput
  ) {
    updateReadingProgress(input: $input, condition: $condition) {
      id
      userId
      currentSurah
      currentAyah
      currentJuz
      completedSurahs
      completedJuzs
      totalAyahsRead
      lastUpdated
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteReadingProgress = /* GraphQL */ `
  mutation DeleteReadingProgress(
    $input: DeleteReadingProgressInput!
    $condition: ModelReadingProgressConditionInput
  ) {
    deleteReadingProgress(input: $input, condition: $condition) {
      id
      userId
      currentSurah
      currentAyah
      currentJuz
      completedSurahs
      completedJuzs
      totalAyahsRead
      lastUpdated
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
      id
      name
      code
      members {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
      id
      name
      code
      members {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
      id
      name
      code
      members {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createProgressHistory = /* GraphQL */ `
  mutation CreateProgressHistory(
    $input: CreateProgressHistoryInput!
    $condition: ModelProgressHistoryConditionInput
  ) {
    createProgressHistory(input: $input, condition: $condition) {
      id
      userId
      date
      surahsRead
      ayahsRead
      juzCompleted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateProgressHistory = /* GraphQL */ `
  mutation UpdateProgressHistory(
    $input: UpdateProgressHistoryInput!
    $condition: ModelProgressHistoryConditionInput
  ) {
    updateProgressHistory(input: $input, condition: $condition) {
      id
      userId
      date
      surahsRead
      ayahsRead
      juzCompleted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteProgressHistory = /* GraphQL */ `
  mutation DeleteProgressHistory(
    $input: DeleteProgressHistoryInput!
    $condition: ModelProgressHistoryConditionInput
  ) {
    deleteProgressHistory(input: $input, condition: $condition) {
      id
      userId
      date
      surahsRead
      ayahsRead
      juzCompleted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createGroupMembers = /* GraphQL */ `
  mutation CreateGroupMembers(
    $input: CreateGroupMembersInput!
    $condition: ModelGroupMembersConditionInput
  ) {
    createGroupMembers(input: $input, condition: $condition) {
      id
      userId
      groupId
      user {
        id
        name
        email
        createdAt
        updatedAt
        userProgressId
        __typename
      }
      group {
        id
        name
        code
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateGroupMembers = /* GraphQL */ `
  mutation UpdateGroupMembers(
    $input: UpdateGroupMembersInput!
    $condition: ModelGroupMembersConditionInput
  ) {
    updateGroupMembers(input: $input, condition: $condition) {
      id
      userId
      groupId
      user {
        id
        name
        email
        createdAt
        updatedAt
        userProgressId
        __typename
      }
      group {
        id
        name
        code
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteGroupMembers = /* GraphQL */ `
  mutation DeleteGroupMembers(
    $input: DeleteGroupMembersInput!
    $condition: ModelGroupMembersConditionInput
  ) {
    deleteGroupMembers(input: $input, condition: $condition) {
      id
      userId
      groupId
      user {
        id
        name
        email
        createdAt
        updatedAt
        userProgressId
        __typename
      }
      group {
        id
        name
        code
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
